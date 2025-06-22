import type { FC } from "react";
import { useState, ReactNode, createContext } from 'react';

import { /*TableActionInterface, */ScreenMessageInterface } from '../../../common/interfaces';
import { /*TableActionEnum, */ScreenMessageTypeEnum } from '../../../common/enums';
// import { tableReducer } from '../../common/helpers';

import { /*FormProductsElementSearchInterface, FormProductsElementInterface, FormProductsElementErrorInterface, */ProductsElementInterface } from '../interfaces';
import { useSearchElement/*, useUpdateElement*/ } from '../graphql/useProductsElement'

// * context
interface ProductsElementContextType {
  // formSearch    : FormProductsElementSearchInterface;
  // formList      : FormProductsElementInterface[];
  // setFormSearch : (formSearch: FormProductsElementSearchInterface) => void;
  searchElements: (name?: string, elementTypeId?: string) => Promise<ProductsElementInterface[]>;
  // updateTable   : (actionType: TableActionEnum, payload?: FormProductsElementInterface | FormProductsElementInterface[]) => void;

  // form        : FormProductsElementInterface;
  // formError   : FormProductsElementErrorInterface;
  // updateForm  : (form: FormProductsElementInterface) => void;
  // saveElement : (form: FormProductsElementInterface) => Promise<ProductsElementInterface>;
  // setFormError: (formError: FormProductsElementErrorInterface) => void;
  // cleanForm   : () => void;
  
  screenMessage     : ScreenMessageInterface;
  setScreenMessage  : (msg: ScreenMessageInterface) => void;
  resetScreenMessage: () => void;
}

export const ProductsElementContext = createContext<ProductsElementContextType | undefined>(undefined);


// * provider
// const initFormSearch: FormProductsElementSearchInterface = {
//   nameCode      : '',
//   productTypeId : ''
// };

// const initForm: FormProductsElementInterface = {
//   id          : undefined,
//   name        : '',
//   code        : '',
//   description : '',
//   cost        : 0,
//   price       : 0,
//   hasFormula  : false,
//   elementList : []
// };

// const initFormError: FormProductsElementErrorInterface = {
//   name: ''
// };

const initScreenMessage: ScreenMessageInterface = {
  type    : ScreenMessageTypeEnum.SUCCESS,
  title   : '',
  message : '',
  show    : false,
};

interface Props {
  children: ReactNode;
}

export const ProductsElementProvider: FC<Props> = ({ children }) => {
  
  // const [formSearch, setFormSearch] = useState<FormProductsElementSearchInterface>(initFormSearch);
  const { fetchElements } = useSearchElement();
  // const [formList, dispatchFormList]= useReducer(tableReducer<FormProductsElementInterface>, []);

  // const [form, setForm]             = useState<FormProductsElementInterface>(initForm);
  // const { mutateElement }           = useUpdateElement();
  // const [formError, setFormError]   = useState<FormProductsElementErrorInterface>(initFormError);
  
  const [screenMessage, setScreenMessage] = useState<ScreenMessageInterface>(initScreenMessage);

  const searchElements = (name?: string, productTypeId?: string): Promise<ProductsElementInterface[]> => {
    // alert(`searchElements: ${nameCode} - ${productTypeId}`);
    
    return fetchElements({ variables: { name, productTypeId } })
    .then( (response) => {
      
      const { productsElementSearchByValues } = response.data || {};
      const { internalCode = 0, message, payload = [] } = productsElementSearchByValues || {};
      
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

  // const updateTable = (actionType: TableActionEnum, payload?: FormProductsElementInterface | FormProductsElementInterface[]) => {
    
  //   const tableAction: TableActionInterface<FormProductsElementInterface> = {
  //     type: actionType,
  //     payload
  //   }

  //   dispatchFormList(tableAction);
  // };

  // const updateForm = (form: FormProductsElementInterface = initForm) => {
  //   setForm(form);
  //   updateTableElementElement(TableActionEnum.LOAD, form.elementList);
  // };

  // const saveElement = (form: FormProductsElementInterface): Promise<ProductsElementInterface> => {

  //   const elementList: ProductsElementElementInterface[] = form.elementList.map( (value) => ({
  //     id      : value.id,
  //     qty     : parseFloat(value.qty.toString()),
  //   }) );

  //   const obj: ProductsElementInterface = {
  //     id              : form.id || undefined,
  //     name            : form.name,
  //     code            : form.code || undefined,
  //     description     : form.description || undefined,
  //     cost            : form.cost || 0,
  //     price           : form.price || 0,
  //     imagenUrl       : form.imagenUrl || undefined,
  //     hasFormula      : false,
  //     productTypeId   : form.productTypeId || undefined,
  //     elementList     : elementList
  //   };

  //   return mutateElement({ variables: { input: obj } })
  //   .then( (response) => {
      
  //     const { productsElementUpdate } = response.data || {};
  //     const { internalCode = 0, message, payload = [] } = productsElementUpdate || {};

  //     if (![200, 400, 404].includes(internalCode)) {
  //       throw new Error(message);
  //     }

  //     if(payload.length === 0) {
  //       throw new Error('no value was returned');
  //     }

  //     return payload[0];
  //   })
  //   .catch((error: any) => {
  //     console.error('saveElement: Error', error);
  //     throw error;
  //   });
  // };

  // const cleanForm = () => {
  //   setForm(initForm);
  //   setFormError(initFormError);
  // };

  const resetScreenMessage = () => setScreenMessage(initScreenMessage);

  return (
    <ProductsElementContext.Provider
      value={{
        // formSearch,
        // formList,
        // setFormSearch,
        searchElements,
        // updateTable,

        // form,
        // formError,
        // updateForm,
        // saveElement,
        // setFormError,
        // cleanForm,

        screenMessage,
        setScreenMessage,
        resetScreenMessage
      }}
    >
      {children}
    </ProductsElementContext.Provider>
  );
};
