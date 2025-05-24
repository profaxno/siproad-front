import type { FC } from "react";
import { useState, useEffect, useReducer, ReactNode, createContext } from 'react';

import { v4 as uuidv4 } from 'uuid';

import { TableActionInterface, ScreenMessageInterface } from '../../../common/interfaces';
import { TableActionEnum, ScreenMessageTypeEnum, ActiveStatusEnum } from '../../../common/enums';
import { tableReducer, tableReducerWithKey } from '../../../common/helpers';

import { FormInventoryProductSearchInterface, FormInventoryProductInterface, FormInventoryProductElementInterface, FormInventoryProductErrorInterface, InventoryProductInterface, InventoryProductElementInterface } from '../interfaces';
import { useSearchProduct, useUpdateProduct, useDeleteProduct } from '../graphql/useInventoryProduct';
import { ProductTypeEnum } from "../enums/product-type.enum";

// * context
interface InventoryProductContextType {
  formSearch    : FormInventoryProductSearchInterface;
  formList      : FormInventoryProductInterface[];
  setFormSearch : (formSearch: FormInventoryProductSearchInterface) => void;
  searchProducts: (nameCode?: string, typeList?: ProductTypeEnum[], productTypeId?: string) => Promise<InventoryProductInterface[]>;
  updateTable   : (actionType: TableActionEnum, payload?: FormInventoryProductInterface | FormInventoryProductInterface[]) => void;

  form          : FormInventoryProductInterface;
  formError     : FormInventoryProductErrorInterface;
  updateForm    : (form: FormInventoryProductInterface) => void;
  updateTableProductElement: (actionType: TableActionEnum, payload?: FormInventoryProductElementInterface | FormInventoryProductElementInterface[]) => void;
  saveProduct   : (form: FormInventoryProductInterface) => Promise<InventoryProductInterface>;
  deleteProduct : (id: string) => Promise<string>;
  setFormError  : (formError: FormInventoryProductErrorInterface) => void;
  cleanForm     : () => void;
  mapObjToForm  : (obj: InventoryProductInterface, level: number) => FormInventoryProductInterface;
  mapFormToObj  : (form: FormInventoryProductInterface, level: number) => InventoryProductInterface;

  screenMessage     : ScreenMessageInterface;
  setScreenMessage  : (msg: ScreenMessageInterface) => void;
  resetScreenMessage: () => void;
  calculateProfitMargin: (form: FormInventoryProductInterface) => number;
}

export const InventoryProductContext = createContext<InventoryProductContextType | undefined>(undefined);


// * provider
const initFormSearch: FormInventoryProductSearchInterface = {
  nameCode: '',
  productCategoryId: ''
};

const initForm: FormInventoryProductInterface = {
  id          : undefined,
  name        : '',
  code        : '',
  description : '',
  unit        : undefined,
  cost        : 0,
  price       : 0,
  type        : ProductTypeEnum.P,
  enable4Sale : false,
  elementList: [],
  status      : ActiveStatusEnum.ACTIVE,
  readonly    : false
};

const initFormError: FormInventoryProductErrorInterface = {
  name: ''
};

const initScreenMessage: ScreenMessageInterface = {
  type    : ScreenMessageTypeEnum.SUCCESS,
  title   : '',
  message : '',
  show    : false,
};

interface Props {
  children: ReactNode;
}

export const InventoryProductProvider: FC<Props> = ({ children }) => {
  
  const [formSearch, setFormSearch] = useState<FormInventoryProductSearchInterface>(initFormSearch);
  const [formList, dispatchFormList]= useReducer(tableReducer<FormInventoryProductInterface>, []);
  const { fetchProducts }           = useSearchProduct();

  const [form, setForm]           = useState<FormInventoryProductInterface>(initForm);
  const [formProductElementList, dispatchFormProductElementList] = useReducer(tableReducerWithKey<FormInventoryProductElementInterface>, []);
  const [formError, setFormError] = useState<FormInventoryProductErrorInterface>(initFormError);
  const { mutateUpdateProduct }   = useUpdateProduct();
  const { mutateDeleteProduct }   = useDeleteProduct();
  
  const [screenMessage, setScreenMessage] = useState<ScreenMessageInterface>(initScreenMessage);

  useEffect(() => {
    setForm({ 
      ...form, 
      cost: calculateProductCost(form), 
      type: calculateProductType(form), 
      elementList: formProductElementList
    });
  }, [formProductElementList]);

  const updateTable = (actionType: TableActionEnum, payload?: FormInventoryProductInterface | FormInventoryProductInterface[]) => {
    
    const tableAction: TableActionInterface<FormInventoryProductInterface> = {
      type: actionType,
      payload
    }

    dispatchFormList(tableAction);
  };

  const searchProducts = (nameCode?: string, productTypeList?: ProductTypeEnum[], productCategoryId?: string): Promise<InventoryProductInterface[]> => {

    return fetchProducts({ variables: { nameCode, productTypeList, productCategoryId } })
    .then( (response) => {
      
      const { inventoryProductSearchByValues } = response.data || {};
      const { internalCode = 0, message, payload = [] } = inventoryProductSearchByValues || {};
      
      if (![200, 400, 404].includes(internalCode)) {
        throw new Error(message);
      }

      return payload;
    })
    .catch((error: any) => {
      console.error('Error searchProducts:', error);
      throw error;
    });

  };

  const updateForm = (form: FormInventoryProductInterface) => {
    setForm(form);
    updateTableProductElement(TableActionEnum.LOAD, form.elementList);
  };
  
  const updateTableProductElement = (actionType: TableActionEnum, payload?: FormInventoryProductElementInterface | FormInventoryProductElementInterface[]) => {

    const tableAction: TableActionInterface<FormInventoryProductElementInterface> = {
      type: actionType,
      payload
    }

    dispatchFormProductElementList(tableAction);
  };

  const saveProduct = (form: FormInventoryProductInterface): Promise<InventoryProductInterface> => {
    const obj = mapFormToObj(form, 0);

    console.log('sdf: '+ JSON.stringify(obj));

    return mutateUpdateProduct({ variables: { input: obj } })
    .then( (response) => {
      
      const { inventoryProductUpdate } = response.data || {};
      const { internalCode = 0, message, payload = [] } = inventoryProductUpdate || {};

      if (![200, 400, 404].includes(internalCode)) {
        throw new Error(message);
      }

      if(payload.length === 0) {
        throw new Error('no value was returned');
      }

      return payload[0];
    })
    .catch((error: any) => {
      console.error('saveProduct: Error', error);
      throw error;
    });
  };

  const deleteProduct = (id: string): Promise<string> => {
    
    return mutateDeleteProduct({ variables: { id } })
    .then( (response) => {
      
      const { inventoryProductDelete } = response.data || {};
      const { internalCode = 0, message = 'OK' } = inventoryProductDelete || {};

      if (![200, 400, 404].includes(internalCode)) {
        throw new Error(message);
      }

      return message;
    })
    .catch((error: any) => {
      console.error('deleteProduct: Error', error);
      throw error;
    });
  }

  const cleanForm = () => {
    setForm(initForm);
    updateTableProductElement(TableActionEnum.CLEAN, []);
    setFormError(initFormError);
  };

  const resetScreenMessage = () => setScreenMessage(initScreenMessage);

  const calculateProductCost = (form: FormInventoryProductInterface): number => {

    const formProductElementList: FormInventoryProductElementInterface[] = form.elementList ?? [];

    if(formProductElementList.length == 0) {
      return form.cost ?? 0;
    }

    let cost = 0;
    for (const formProductElement of formProductElementList) {
      const formElement = formProductElement.element;

      if(formElement.type === ProductTypeEnum.PC || formElement.type === ProductTypeEnum.PCC) {
        cost += formProductElement.qty * calculateProductCost(formElement);
      } else {
        cost += formProductElement.qty * (formElement.cost ?? 0);
      }
    }

    return cost;
  }

  // const calculateCost = (formProductElementList: FormInventoryProductElementInterface[]) => {

  //   if(formProductElementList.length === 0) 
  //     return 0;

  //   const cost = formProductElementList.reduce((acc, value) => {
  //     if(value.status === 1) {
  //       acc += value.cost * value.qty;
  //     }
  //     return acc;
  //   }, 0);

  //   return cost;
  // }

  const calculateProductType = (form: FormInventoryProductInterface): ProductTypeEnum => {
    let productType = ProductTypeEnum.P;

    const formElementList: FormInventoryProductElementInterface[] = form.elementList ?? [];
    if(formElementList.length > 0) {
      productType = ProductTypeEnum.PC;
    }

    const formCompositeElementList = formElementList.filter(value => value.element.type == ProductTypeEnum.PC)
    if(formCompositeElementList.length > 0) {
      productType = ProductTypeEnum.PCC;
    }

    return productType;
  }

  const calculateProfitMargin = (form: FormInventoryProductInterface): number => {
    const cost = form.cost || 0;
    const price = form.price || 0;
    const profitMargin = ((price - cost) / price) * 100;

    if(profitMargin < 0) 
      return 0;

    return profitMargin;
  }

  const mapObjToForm = (obj: InventoryProductInterface/*, productElementList: InventoryProductElementInterface[] = []*/, level: number): FormInventoryProductInterface => {

    if(level == 2) {
      const form: FormInventoryProductInterface = {
        companyId: obj.companyId,
        id: obj.id,
        productCategoryId: obj.productCategoryId,
        name: obj.name,
        code: obj.code,
        description: obj.description,
        unit: obj.unit,
        cost: obj.cost,
        price: obj.price,
        type: obj.type,
        enable4Sale: obj.enable4Sale,
        elementList: [],
        status: ActiveStatusEnum.ACTIVE,
        readonly: false
        // new ProductDto(product.company.id, product.name, product.cost, product.type, product.enable4Sale, product.id, product.productCategory?.id, product.code, product.description, product.unit, product.price, [])
      }

      return form;
    }

    const productElementList: InventoryProductElementInterface[] = obj.elementList ?? [];

    // * generate product-element form list
    let formElementList: FormInventoryProductElementInterface[] = [];
    for (const productElement of productElementList) {
      const element = productElement.element;
      const formElement = mapObjToForm(element/*, element.elementList*/, level + 1);
      const formProductElement = { key: uuidv4(), element: formElement, qty: productElement.qty, status: ActiveStatusEnum.ACTIVE };
      formElementList.push(formProductElement);
    }

    // * generate form
    const form: FormInventoryProductInterface = {
      companyId: obj.companyId,
      id: obj.id,
      productCategoryId: obj.productCategoryId,
      name: obj.name,
      code: obj.code,
      description: obj.description,
      unit: obj.unit,
      cost: obj.cost,
      price: obj.price,
      type: obj.type,
      enable4Sale: obj.enable4Sale,
      elementList: formElementList,
      status: ActiveStatusEnum.ACTIVE,
      readonly: false
      // new ProductDto(product.company.id, product.name, product.cost, product.type, product.enable4Sale, product.id, product.productCategory?.id, product.code, product.description, product.unit, product.price, [])
    }

    return form;
  }

  const mapFormToObj = (form: FormInventoryProductInterface, level: number): InventoryProductInterface => {

    if(level == 2) {
      const obj: InventoryProductInterface = {
        companyId   : form.companyId,
        id          : form.id || undefined,
        productCategoryId: form.productCategoryId || undefined,
        name        : form.name,
        code        : form.code         || undefined,
        description : form.description  || undefined,
        cost        : form.cost         || 0,
        price       : form.price        || 0,
        type        : form.type         || 0,
        enable4Sale : form.enable4Sale  || false,
        elementList : []
      }

      return obj;
    }

    const formProductElementList: FormInventoryProductElementInterface[] = form.elementList ?? [];

    // * generate product-element form list
    let elementList: InventoryProductElementInterface[] = [];
    for (const formProductElement of formProductElementList) {
      const formElement = formProductElement.element ;
      const element = mapFormToObj(formElement, level + 1);
      const productElement = { element, qty: formProductElement.qty };
      elementList.push(productElement);
    }

    // * generate form
    const obj: InventoryProductInterface = {
      companyId   : form.companyId,
      id          : form.id || undefined,
      productCategoryId: form.productCategoryId || undefined,
      name        : form.name,
      code        : form.code         || undefined,
      description : form.description  || undefined,
      cost        : form.cost         || 0,
      price       : form.price        || 0,
      type        : form.type         || 0,
      enable4Sale : form.enable4Sale  || false,
      elementList
    }

    return obj;
  }
  
  return (
    <InventoryProductContext.Provider
      value={{
        formSearch,
        formList,
        setFormSearch,
        searchProducts,
        updateTable,

        form,
        formError,
        updateForm,
        updateTableProductElement,
        saveProduct,
        deleteProduct,
        setFormError,
        cleanForm,
        mapObjToForm,
        mapFormToObj,
        
        screenMessage,
        setScreenMessage,
        resetScreenMessage,
        calculateProfitMargin
      }}
    >
      {children}
    </InventoryProductContext.Provider>
  );
};
