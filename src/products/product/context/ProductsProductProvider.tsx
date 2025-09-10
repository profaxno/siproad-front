import type { FC } from "react";
import { useState, useEffect, useReducer, ReactNode } from 'react';

import { v4 as uuidv4 } from 'uuid';

import { TableActionInterface, ScreenMessageInterface } from '../../../common/interfaces';
import { TableActionEnum, ScreenMessageTypeEnum, ActiveStatusEnum, ActionEnum } from '../../../common/enums';
import { tableReducer, tableReducerWithKey } from '../../../common/helpers';

import { useSearchProduct, useUpdateProduct, useDeleteProduct } from '../graphql/useProductsProduct';
import { useSearchProductUnit } from '../graphql/useProductsProductUnit';
import { FormProductsProductSearchDto, FormProductsProductDto, FormProductsProductElementDto, FormProductsProductErrorDto } from '../dto';
import { ProductsProductInterface, ProductsProductElementInterface, ProductsProductUnitInterface } from '../interfaces';
import { ProductTypeEnum } from "../enums";
import { productsProductContext } from './products-product.context';

// * provider
const initFormSearch: FormProductsProductSearchDto = {
  nameCode: '',
  productCategoryId: '',
  enable4Sale: true
};

const initForm: FormProductsProductDto = {
  id          : undefined,
  companyId   : undefined,
  name        : '',
  code        : '',
  description : '',
  unit        : undefined,
  cost        : 0,
  price       : 0,
  type        : ProductTypeEnum.P,
  enable4Sale : true,
  status      : ActiveStatusEnum.NEW,
  productUnitId : undefined,
  elementList : [],
  movementList: []
};

const initFormError: FormProductsProductErrorDto = {
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
  
  const [formSearch, setFormSearch] = useState<FormProductsProductSearchDto>(initFormSearch);
  const [formList, dispatchFormList]= useReducer(tableReducer<FormProductsProductDto>, []);
  const { fetchProducts }           = useSearchProduct();

  const [isOpenSearchSection, setIsOpenSearchSection] = useState<boolean>(true);
  const [isOpenFormSection, setIsOpenFormSection] = useState<boolean>(true);
  const [form, setForm]           = useState<FormProductsProductDto>(initForm);
  const [formProductElementList, dispatchFormProductElementList] = useReducer(tableReducerWithKey<FormProductsProductElementDto>, []);
  const [formError, setFormError] = useState<FormProductsProductErrorDto>(initFormError);
  const { fetchProductUnits }     = useSearchProductUnit()
  const { mutateUpdateProduct }   = useUpdateProduct();
  const { mutateDeleteProduct }   = useDeleteProduct();
  
  const [actionList, setActionList]= useState<ActionEnum[]>([]);

  const [screenMessage, setScreenMessage] = useState<ScreenMessageInterface>(initScreenMessage);

  useEffect(() => {
    setForm({ 
      ...form, 
      cost: calculateProductCost(formProductElementList, form.cost),
      type: calculateProductType(formProductElementList),
      elementList: formProductElementList
    });
  }, [formProductElementList]);

  const updateTable = (actionType: TableActionEnum, payload?: FormProductsProductDto | FormProductsProductDto[]) => {
    
    const tableAction: TableActionInterface<FormProductsProductDto> = {
      type: actionType,
      payload
    }

    dispatchFormList(tableAction);
  };

  const searchProducts = (withMovements: boolean, nameCode?: string, productTypeList?: ProductTypeEnum[], productCategoryId?: string, enable4Sale?: boolean): Promise<ProductsProductInterface[]> => {
    
    return fetchProducts({ variables: { nameCode, productTypeList, productCategoryId, withMovements, enable4Sale } })
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

  const updateForm = (form: FormProductsProductDto) => {
    setForm(form);
    updateTableProductElement(TableActionEnum.LOAD, form.elementList);
  };
  
  const updateTableProductElement = (actionType: TableActionEnum, payload?: FormProductsProductElementDto | FormProductsProductElementDto[]) => {
    
    const tableAction: TableActionInterface<FormProductsProductElementDto> = {
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

      const formAux: FormProductsProductDto = {
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
    const newErrors: FormProductsProductErrorDto = {};

    if (!form.name) newErrors.name = "Ingrese el nombre del producto";
    
    setFormError(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const saveProduct = (form: FormProductsProductDto): Promise<ProductsProductInterface> => {
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
      const formAux: FormProductsProductDto = {
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

  const calculateProductCost = (principalProductElementList: FormProductsProductElementDto[] = [], principalProductCost: number = 0): number => {
    
    if(principalProductElementList.length == 0) {
      return principalProductCost;
    }

    let calculatedCost = 0;

    for (const productElement of principalProductElementList) {
      const product = productElement.element;
      const productCost = product.cost ?? 0;
      const productElementList = product.elementList ? product.elementList : [];
      
      if(productElementList.length > 0) {
        calculatedCost += productElement.qty * calculateProductCost(productElementList, productCost);
      } else {
        calculatedCost += productElement.qty * productCost;
      }
    }

    return calculatedCost;
  }

  // const calculateCost = (formProductElementList: FormProductsProductElementDto[]) => {

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

  const calculateProductType = (formElementList: FormProductsProductElementDto[] = []): ProductTypeEnum => {
    let productType = ProductTypeEnum.P;

    // const formElementList: FormProductsProductElementDto[] = form.elementList ?? [];

    if(formElementList.length > 0) {
      productType = ProductTypeEnum.PC;
    }

    const formCompositeElementList = formElementList.filter(value => value.element.type == ProductTypeEnum.PC)
    if(formCompositeElementList.length > 0) {
      productType = ProductTypeEnum.PCC;
    }

    return productType;
  }

  const calculateProfitMargin = (form: FormProductsProductDto): number => {
    const cost = form.cost || 0;
    const price = form.price || 0;
    const profitMargin = ((price - cost) / price) * 100;

    if(profitMargin < 0) 
      return 0;

    return profitMargin;
  }

  const mapObjToForm = (obj: ProductsProductInterface/*, productElementList: ProductsProductElementInterface[] = []*/, level: number): FormProductsProductDto => {

    if(level == 2) {
      const form = new FormProductsProductDto(obj.name, obj.type, obj.enable4Sale, obj.code, obj.description, obj.unit, obj.cost, obj.price, ActiveStatusEnum.ACTIVE, obj.id, obj.companyId, obj.productCategoryId, obj.productUnitId, [], obj.movementList);

      // const form: FormProductsProductDto = {
      //   id: obj.id,
      //   name: obj.name,
      //   code: obj.code,
      //   description: obj.description,
      //   unit: obj.unit,
      //   cost: obj.cost,
      //   price: obj.price,
      //   type: obj.type,
      //   enable4Sale: obj.enable4Sale,
      //   status: ActiveStatusEnum.ACTIVE,
      //   companyId: obj.companyId,
      //   productCategoryId: obj.productCategoryId,
      //   productUnitId: obj.productUnitId,
      //   elementList: [],
      //   movementList: obj.movementList
      // }

      return form;
    }

    const productElementList: ProductsProductElementInterface[] = obj.elementList ?? [];

    // * generate product-element form list
    let formElementList: FormProductsProductElementDto[] = [];
    for (const productElement of productElementList) {
      const element = productElement.element;
      const formElement = mapObjToForm(element/*, element.elementList*/, level + 1);
      const formProductElement = { key: uuidv4(), element: formElement, qty: productElement.qty, status: ActiveStatusEnum.ACTIVE };
      formElementList.push(formProductElement);
    }

    // * generate form
    const form = new FormProductsProductDto(obj.name, obj.type, obj.enable4Sale, obj.code, obj.description, obj.unit, obj.cost, obj.price, ActiveStatusEnum.ACTIVE, obj.id, obj.companyId, obj.productCategoryId, obj.productUnitId, formElementList, obj.movementList);

    // const form: FormProductsProductDto = {
    //   id: obj.id,
    //   name: obj.name,
    //   code: obj.code,
    //   description: obj.description,
    //   unit: obj.unit,
    //   cost: obj.cost,
    //   price: obj.price,
    //   type: obj.type,
    //   enable4Sale: obj.enable4Sale,
    //   status: ActiveStatusEnum.ACTIVE,
    //   companyId: obj.companyId,
    //   productCategoryId: obj.productCategoryId,
    //   productUnitId: obj.productUnitId,
    //   elementList: formElementList,
    //   movementList: obj.movementList
    // }

    return form;
  }

  const mapFormToObj = (form: FormProductsProductDto, level: number): ProductsProductInterface => {

    if(level == 2) {
      const obj: ProductsProductInterface = {
        id          : form.id,
        companyId   : form.companyId,
        name        : form.name,
        code        : form.code,
        description : form.description,
        cost        : form.cost         ?? 0,
        price       : form.price        ?? 0,
        type        : form.type         ?? 0,
        enable4Sale : form.enable4Sale  ?? false,
        productCategoryId: form.productCategoryId,
        productUnitId: form.productUnitId,
        elementList : [],
        movementList: form.movementList ?? []
      }

      return obj;
    }

    let formProductElementList: FormProductsProductElementDto[] = form.elementList ?? [];
    formProductElementList = formProductElementList.filter(value => value.status == ActiveStatusEnum.ACTIVE);

    // * generate product-element form list
    let elementList: ProductsProductElementInterface[] = [];
    for (const formProductElement of formProductElementList) {
      const formElement = formProductElement.element ;
      const element = mapFormToObj(formElement, level + 1);
      const productElement = { element, qty: formProductElement.qty };
      elementList.push(productElement);
    }

    // * generate obj
    const obj: ProductsProductInterface = {
      id          : form.id,
      companyId   : form.companyId,
      name        : form.name,
      code        : form.code,
      description : form.description,
      cost        : form.cost         ?? 0,
      price       : form.price        ?? 0,
      type        : form.type         ?? 0,
      enable4Sale : form.enable4Sale  ?? false,
      productCategoryId: form.productCategoryId,
      productUnitId: form.productUnitId,
      elementList,
      movementList: form.movementList ?? []
    }

    return obj;
  }
  
  const searchProductUnits = (name?: string): Promise<ProductsProductUnitInterface[]> => {

    return fetchProductUnits({ variables: { name } })
    .then( (response) => {

      const { productsProductUnitSearchByValues } = response.data || {};
      const { internalCode = 0, message, payload = [] } = productsProductUnitSearchByValues || {};

      if (![200, 400, 404].includes(internalCode)) {
        throw new Error(message);
      }

      return payload;
    })
    .catch((error: any) => {
      console.error('Error searchProductUnits:', error);
      throw error;
    });

  };

  return (
    <productsProductContext.Provider
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
        // formProductElementList,
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
        calculateProfitMargin,

        searchProductUnits
      }}
    >
      {children}
    </productsProductContext.Provider>
  );
};
