import { useState, useReducer } from 'react'

import { ProductsElementContext } from './ProductsElementContext';
import { useSearchElements } from '../hooks/useProductsElement';

import { tableReducer } from '../../common/hooks/TableReducer'
import { TableActionEnum } from '../../common/enums/table-actions.enum';

const initObj = {
  id: 0,
  name: "",
  code: "",
  description: "",
  cost: 0,
  price: 0,
  hasFormula: false,
  active: true
}

export const ProductsElementProvider = ({ children }) => {

  // * hooks
  const [obj, setObj] = useState(initObj);
  const [objList, dispatchObjList] = useReducer(tableReducer, []); // * reducer, init state, init function
  const [errors, setErrors] = useState({});
  const { fetchElements/*, productList = [], loading, error*/ } = useSearchElements();
  // const { mutateElement/*, data, loading, error*/ } = useUpdateElement(); 

  // * handles
  const updateForm = (obj = initObj) => {
    console.log(`updateForm: ${JSON.stringify(obj)}`);
    setObj(obj);
  }

  const updateTable = (obj, actionType) => { // * obj can be a value or an array

    if(obj.length > 0)
      console.log(`updateTable: obj=(${obj.length}), actionType=${actionType}`);
    else console.log(`updateTable: obj=${JSON.stringify(obj)}, actionType=${actionType}`);

    if(actionType === TableActionEnum.DELETE)
      sendDelete(obj);

    const action = {
      type: actionType,
      payload: obj
    }

    dispatchObjList( action );
  }

  // * api handles
  // const saveProduct = (obj) => {
  //   console.log(`saveProduct: obj=${JSON.stringify(obj)}`);
    
  //   const elementListAux = obj.elementList.map((value) => {
  //     return {
  //       id  : value.id,
  //       name: value.name,
  //       qty : parseFloat(value.qty)
  //     }
  //   });

  //   const objAux = {
  //     id          : obj.id ? obj.id : undefined,
  //     name        : obj.name,
  //     code        : obj.code ? obj.code : undefined,
  //     description : obj.description ? obj.description : undefined,
  //     cost        : parseFloat(obj.cost),
  //     price       : parseFloat(obj.price),
  //     hasFormula  : obj.hasFormula ? obj.hasFormula : false,
  //     active      : obj.active,
  //     elementList : elementListAux,
  //   }

  //   return mutateProduct({ variables: { product: objAux } })
  //   .then(({ data }) => {
  //     console.log(`saveProduct: data=${JSON.stringify(data)}`);
  //     const payload = data?.productsProductUpdate?.payload || [];
  //     return payload[0];
  //   })
  //   .catch((error) => {
  //     console.error('Error saving product:', error);
  //   });
  // }

  const findElements = (name) => {

    const searchList = [name];

    return fetchElements({ variables: { searchList } })
    .then(({ data }) => {
      const payload = data?.productsElementFind?.payload || [];
      console.log(`fetchElements: data=${JSON.stringify(payload)}`);
      return payload;
    })
    .catch((error) => {
      console.error('Error fetching elements:', error);
    });

  }

  // * return component
  return (
    <ProductsElementContext.Provider value={{ obj, objList, updateForm, updateTable, /*saveElement,*/ findElements, errors, setErrors }}>
      {children}
    </ProductsElementContext.Provider>
  )
}
