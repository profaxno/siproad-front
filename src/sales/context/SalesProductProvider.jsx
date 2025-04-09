import { useState, useReducer } from 'react'

import { SalesProductContext } from './SalesProductContext';
import { useSearchProducts } from '../hooks/useSalesProduct';

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

export const SalesProductProvider = ({ children }) => {

  // * hooks
  const [obj, setObj] = useState(initObj);
  const [objList, dispatchObjList] = useReducer(tableReducer, []); // * reducer, init state, init function
  const [errors, setErrors] = useState({});
  const { fetchProducts/*, productList = [], loading, error*/ } = useSearchProducts();
  
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
  const findProducts = (name) => {

    const searchList = [name];

    return fetchProducts({ variables: { searchList } })
    .then(({ data }) => {
      const payload = data?.salesProductFind?.payload || [];
      console.log(`findProducts: data=${JSON.stringify(payload)}`);
      return payload;
    })
    .catch((error) => {
      console.error('Error fetching elements:', error);
    });

  }

  // * return component
  return (
    <SalesProductContext.Provider 
      value={{ 
        obj, 
        objList, 
        updateForm, 
        updateTable, 
        findProducts, 
        errors, 
        setErrors 
      }}>
      {children}
    </SalesProductContext.Provider>
  )
}
