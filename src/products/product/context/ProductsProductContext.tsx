import type { FC } from "react";
import { useState, useEffect, useReducer, ReactNode, createContext } from 'react';

import { TableActionInterface, ScreenMessageInterface } from '../../../common/interfaces';
import { TableActionEnum, ScreenMessageTypeEnum, ActiveStatusEnum } from '../../../common/enums';
import { tableReducer, tableReducerWithKey } from '../../../common/helpers';

import { FormProductsProductSearchInterface, FormProductsProductInterface, FormProductsProductElementInterface, FormProductsProductErrorInterface, ProductsProductInterface, ProductsProductElementInterface } from '../interfaces';
import { useSearchProduct, useUpdateProduct, useDeleteProduct } from '../graphql/useProductsProduct';

// * context
interface ProductsProductContextType {
  formSearch    : FormProductsProductSearchInterface;
  formList      : FormProductsProductInterface[];
  setFormSearch : (formSearch: FormProductsProductSearchInterface) => void;
  searchProducts: (nameCode?: string, productTypeId?: string) => Promise<ProductsProductInterface[]>;
  updateTable   : (actionType: TableActionEnum, payload?: FormProductsProductInterface | FormProductsProductInterface[]) => void;

  form          : FormProductsProductInterface;
  formError     : FormProductsProductErrorInterface;
  updateForm    : (form: FormProductsProductInterface) => void;
  updateTableProductElement: (actionType: TableActionEnum, payload?: FormProductsProductElementInterface | FormProductsProductElementInterface[]) => void;
  saveProduct   : (form: FormProductsProductInterface) => Promise<ProductsProductInterface>;
  deleteProduct : (id: string) => Promise<string>;
  setFormError  : (formError: FormProductsProductErrorInterface) => void;
  cleanForm     : () => void;
  
  screenMessage     : ScreenMessageInterface;
  setScreenMessage  : (msg: ScreenMessageInterface) => void;
  resetScreenMessage: () => void;
  calculateProfitMargin: (form: FormProductsProductInterface) => number;
}

export const ProductsProductContext = createContext<ProductsProductContextType | undefined>(undefined);


// * provider
const initFormSearch: FormProductsProductSearchInterface = {
  nameCode      : '',
  productTypeId : ''
};

const initForm: FormProductsProductInterface = {
  id          : undefined,
  name        : '',
  code        : '',
  description : '',
  cost        : 0,
  price       : 0,
  hasFormula  : false,
  elementList : [],
  status      : ActiveStatusEnum.ACTIVE,
  readonly    : false
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

  const [form, setForm]           = useState<FormProductsProductInterface>(initForm);
  const [formProductElementList, dispatchFormProductElementList] = useReducer(tableReducerWithKey<FormProductsProductElementInterface>, []);
  const [formError, setFormError] = useState<FormProductsProductErrorInterface>(initFormError);
  const { mutateUpdateProduct }   = useUpdateProduct();
  const { mutateDeleteProduct }   = useDeleteProduct();
  
  const [screenMessage, setScreenMessage] = useState<ScreenMessageInterface>(initScreenMessage);

  useEffect(() => {
    setForm({ ...form, cost: calculateCost(formProductElementList), elementList: formProductElementList });
  }, [formProductElementList]);

  const updateTable = (actionType: TableActionEnum, payload?: FormProductsProductInterface | FormProductsProductInterface[]) => {
    
    const tableAction: TableActionInterface<FormProductsProductInterface> = {
      type: actionType,
      payload
    }

    dispatchFormList(tableAction);
  };

  const searchProducts = (nameCode?: string, productTypeId?: string): Promise<ProductsProductInterface[]> => {

    return fetchProducts({ variables: { nameCode, productTypeId } })
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

  const saveProduct = (form: FormProductsProductInterface): Promise<ProductsProductInterface> => {

    const elementList: ProductsProductElementInterface[] = form.elementList.map( (value) => ({
      id      : value.id,
      qty     : parseFloat(value.qty.toString()),
    }) );

    const obj: ProductsProductInterface = {
      id              : form.id || undefined,
      name            : form.name,
      code            : form.code || undefined,
      description     : form.description || undefined,
      cost            : form.cost || 0,
      price           : form.price || 0,
      imagenUrl       : form.imagenUrl || undefined,
      hasFormula      : false,
      productTypeId   : form.productTypeId || undefined,
      elementList     : elementList
    };

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
      console.error('saveProduct: Error', error);
      throw error;
    });
  };

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

  const calculateCost = (formProductElementList: FormProductsProductElementInterface[]) => {

    if(formProductElementList.length === 0) 
      return 0;

    const cost = formProductElementList.reduce((acc, value) => {
      if(value.status === 1) {
        acc += value.cost * value.qty;
      }
      return acc;
    }, 0);

    return cost;
  }

  const calculateProfitMargin = (form: FormProductsProductInterface): number => {
    const cost = form.cost || 0;
    const price = form.price || 0;
    const profitMargin = ((price - cost) / price) * 100;

    if(profitMargin < 0) 
      return 0;

    return profitMargin;
  }

  return (
    <ProductsProductContext.Provider
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
