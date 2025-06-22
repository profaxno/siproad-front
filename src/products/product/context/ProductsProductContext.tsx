import type { FC } from "react";
import { useState, useEffect, useReducer, ReactNode, createContext } from 'react';

import { v4 as uuidv4 } from 'uuid';

import { TableActionInterface, ScreenMessageInterface } from '../../../common/interfaces';
import { TableActionEnum, ScreenMessageTypeEnum, ActiveStatusEnum } from '../../../common/enums';
import { tableReducer, tableReducerWithKey } from '../../../common/helpers';

import { FormProductsProductSearchInterface, FormProductsProductInterface, FormProductsProductElementInterface, FormProductsProductErrorInterface, ProductsProductInterface, ProductsProductElementInterface } from '../interfaces';
import { useSearchProduct, useUpdateProduct, useDeleteProduct } from '../graphql/useProductsProduct';
import { ProductTypeEnum } from "../enums/product-type.enum";
import { ActionEnum } from "../../../common/enums/action.enum";

// * context
interface ProductsProductContextType {
  formSearch    : FormProductsProductSearchInterface;
  formList      : FormProductsProductInterface[];
  setFormSearch : (formSearch: FormProductsProductSearchInterface) => void;
  searchProducts: (nameCode?: string, typeList?: ProductTypeEnum[], productTypeId?: string) => Promise<ProductsProductInterface[]>;
  updateTable   : (actionType: TableActionEnum, payload?: FormProductsProductInterface | FormProductsProductInterface[]) => void;

  actionList    : ActionEnum[];
  setActionList : (actionList: ActionEnum[]) => void;

  isOpenSearchSection : boolean;
  isOpenFormSection   : boolean;
  setIsOpenSearchSection: (isOpenSearchSection: boolean) => void; 
  setIsOpenFormSection: (isOpenFormSection: boolean) => void; 

  form          : FormProductsProductInterface;
  formError     : FormProductsProductErrorInterface;
  updateForm    : (form: FormProductsProductInterface) => void;
  updateTableProductElement: (actionType: TableActionEnum, payload?: FormProductsProductElementInterface | FormProductsProductElementInterface[]) => void;
  
  saveForm      : () => void;
  deleteForm    : () => void;
  setFormError  : (formError: FormProductsProductErrorInterface) => void;
  cleanForm     : () => void;
  mapObjToForm  : (obj: ProductsProductInterface, level: number) => FormProductsProductInterface;
  mapFormToObj  : (form: FormProductsProductInterface, level: number) => ProductsProductInterface;

  screenMessage     : ScreenMessageInterface;
  setScreenMessage  : (msg: ScreenMessageInterface) => void;
  resetScreenMessage: () => void;
  calculateProfitMargin: (form: FormProductsProductInterface) => number;
}

export const ProductsProductContext = createContext<ProductsProductContextType | undefined>(undefined);


// * provider
const initFormSearch: FormProductsProductSearchInterface = {
  nameCode: '',
  productCategoryId: ''
};

const initForm: FormProductsProductInterface = {
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
  status      : ActiveStatusEnum.NEW
};

const initFormError: FormProductsProductErrorInterface = {
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

export const ProductsProductProvider: FC<Props> = ({ children }) => {
  
  const [formSearch, setFormSearch] = useState<FormProductsProductSearchInterface>(initFormSearch);
  const [formList, dispatchFormList]= useReducer(tableReducer<FormProductsProductInterface>, []);
  const { fetchProducts }           = useSearchProduct();

  const [isOpenSearchSection, setIsOpenSearchSection] = useState<boolean>(true);
  const [isOpenFormSection, setIsOpenFormSection] = useState<boolean>(true);
  const [form, setForm]           = useState<FormProductsProductInterface>(initForm);
  const [formProductElementList, dispatchFormProductElementList] = useReducer(tableReducerWithKey<FormProductsProductElementInterface>, []);
  const [formError, setFormError] = useState<FormProductsProductErrorInterface>(initFormError);
  const { mutateUpdateProduct }   = useUpdateProduct();
  const { mutateDeleteProduct }   = useDeleteProduct();
  
  const [actionList, setActionList]= useState<ActionEnum[]>([]);

  const [screenMessage, setScreenMessage] = useState<ScreenMessageInterface>(initScreenMessage);

  useEffect(() => {
    setForm({ 
      ...form, 
      cost: calculateProductCost(form), 
      type: calculateProductType(form), 
      elementList: formProductElementList
    });
  }, [formProductElementList]);

  const updateTable = (actionType: TableActionEnum, payload?: FormProductsProductInterface | FormProductsProductInterface[]) => {
    
    const tableAction: TableActionInterface<FormProductsProductInterface> = {
      type: actionType,
      payload
    }

    dispatchFormList(tableAction);
  };

  const searchProducts = (nameCode?: string, productTypeList?: ProductTypeEnum[], productCategoryId?: string): Promise<ProductsProductInterface[]> => {

    return fetchProducts({ variables: { nameCode, productTypeList, productCategoryId } })
    .then( (response) => {
      
      const { productsProductSearchByValues } = response.data || {};
      const { internalCode = 0, message, payload = [] } = productsProductSearchByValues || {};
      
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

  const updateForm = (form: FormProductsProductInterface) => {
    setForm(form);
    updateTableProductElement(TableActionEnum.LOAD, form.elementList);
  };
  
  const updateTableProductElement = (actionType: TableActionEnum, payload?: FormProductsProductElementInterface | FormProductsProductElementInterface[]) => {

    const tableAction: TableActionInterface<FormProductsProductElementInterface> = {
      type: actionType,
      payload
    }

    dispatchFormProductElementList(tableAction);
  };

  const saveForm = () => {
    if (!validate()) return;

    saveProduct(form)
    .then( (mutatedObj: ProductsProductInterface) => {
      const found = formList.find((value) => value.id === form.id);
      const actionType = found ? TableActionEnum.UPDATE : TableActionEnum.ADD;

      const formAux: FormProductsProductInterface = {
        ...form,
        id: mutatedObj.id
      };

      cleanForm();
      updateTable(actionType, formAux);
      setIsOpenFormSection(true);
      setScreenMessage({ type: ScreenMessageTypeEnum.SUCCESS, title: "Información", message: "Guardado Exitoso!", show: true });
    })
    .catch(() => {
      setScreenMessage({ type: ScreenMessageTypeEnum.ERROR, title: "Problema", message: 'No se completó la operación, intente de nuevo', show: true });
    });
  };

  const validate = (): boolean => {
    const newErrors: FormProductsProductErrorInterface = {};

    if (!form.name) newErrors.name = "Ingrese el nombre del producto";
    
    setFormError(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const saveProduct = (form: FormProductsProductInterface): Promise<ProductsProductInterface> => {
    const obj = mapFormToObj(form, 0);

    return mutateUpdateProduct({ variables: { input: obj } })
    .then( (response) => {
      
      const { productsProductUpdate } = response.data || {};
      const { internalCode = 0, message, payload = [] } = productsProductUpdate || {};

      if (![200, 400, 404].includes(internalCode)) {
        throw new Error(message);
      }

      if(payload.length === 0) {
        throw new Error('no value was returned');
      }

      return payload[0];
    })
    .catch((error: any) => {
      console.error(`saveProduct: ${JSON.stringify(error)}`);
      console.error('saveProduct: Error', error);
      throw error;
    });
  };

  const deleteForm = () => {
    if (!form.id)
      throw new Error("deleteForm: form.id is undefined");
    
    deleteProduct(form.id)
    .then( () => {
      const formAux: FormProductsProductInterface = {
        ...form,
        status: ActiveStatusEnum.DELETED
      };

      cleanForm();
      updateTable(TableActionEnum.DELETE, formAux);
      setIsOpenFormSection(true);
      setScreenMessage({ type: ScreenMessageTypeEnum.SUCCESS, title: "Información", message: "Eliminación Exitosa!", show: true });
    })
    .catch(() => {
      setScreenMessage({ type: ScreenMessageTypeEnum.ERROR, title: "Problema", message: 'No se completó la operación, intente de nuevo', show: true });
    });
  }

  const deleteProduct = (id: string): Promise<string> => {
    
    return mutateDeleteProduct({ variables: { id } })
    .then( (response) => {
      
      const { productsProductDelete } = response.data || {};
      const { internalCode = 0, message = 'OK' } = productsProductDelete || {};

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

  const calculateProductCost = (form: FormProductsProductInterface): number => {

    const formProductElementList: FormProductsProductElementInterface[] = form.elementList ?? [];

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

  // const calculateCost = (formProductElementList: FormProductsProductElementInterface[]) => {

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

  const calculateProductType = (form: FormProductsProductInterface): ProductTypeEnum => {
    let productType = ProductTypeEnum.P;

    const formElementList: FormProductsProductElementInterface[] = form.elementList ?? [];
    if(formElementList.length > 0) {
      productType = ProductTypeEnum.PC;
    }

    const formCompositeElementList = formElementList.filter(value => value.element.type == ProductTypeEnum.PC)
    if(formCompositeElementList.length > 0) {
      productType = ProductTypeEnum.PCC;
    }

    return productType;
  }

  const calculateProfitMargin = (form: FormProductsProductInterface): number => {
    const cost = form.cost || 0;
    const price = form.price || 0;
    const profitMargin = ((price - cost) / price) * 100;

    if(profitMargin < 0) 
      return 0;

    return profitMargin;
  }

  const mapObjToForm = (obj: ProductsProductInterface/*, productElementList: ProductsProductElementInterface[] = []*/, level: number): FormProductsProductInterface => {

    if(level == 2) {
      const form: FormProductsProductInterface = {
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
      }

      return form;
    }

    const productElementList: ProductsProductElementInterface[] = obj.elementList ?? [];

    // * generate product-element form list
    let formElementList: FormProductsProductElementInterface[] = [];
    for (const productElement of productElementList) {
      const element = productElement.element;
      const formElement = mapObjToForm(element/*, element.elementList*/, level + 1);
      const formProductElement = { key: uuidv4(), element: formElement, qty: productElement.qty, status: ActiveStatusEnum.ACTIVE };
      formElementList.push(formProductElement);
    }

    // * generate form
    const form: FormProductsProductInterface = {
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
      status: ActiveStatusEnum.ACTIVE
    }

    return form;
  }

  const mapFormToObj = (form: FormProductsProductInterface, level: number): ProductsProductInterface => {

    if(level == 2) {
      const obj: ProductsProductInterface = {
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

    const formProductElementList: FormProductsProductElementInterface[] = form.elementList ?? [];

    // * generate product-element form list
    let elementList: ProductsProductElementInterface[] = [];
    for (const formProductElement of formProductElementList) {
      const formElement = formProductElement.element ;
      const element = mapFormToObj(formElement, level + 1);
      const productElement = { element, qty: formProductElement.qty };
      elementList.push(productElement);
    }

    // * generate form
    const obj: ProductsProductInterface = {
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
    <ProductsProductContext.Provider
      value={{
        formSearch,
        formList,
        setFormSearch,
        searchProducts,
        updateTable,

        actionList,
        setActionList,

        isOpenSearchSection,
        isOpenFormSection,
        setIsOpenSearchSection,
        setIsOpenFormSection,

        form,
        formError,
        updateForm,
        updateTableProductElement,
        saveForm,
        deleteForm,
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
    </ProductsProductContext.Provider>
  );
};
