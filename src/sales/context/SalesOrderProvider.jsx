import { useState, useEffect, useReducer } from 'react'

import { SalesOrderContext } from './SalesOrderContext';

import { tableReducer } from '../../common/hooks/TableReducer'
import { TableActionEnum } from '../../common/enums/table-actions.enum';
import { useDeleteOrder, useSearchOrder, useUpdateOrder } from '../hooks/useSalesOrder';

const initObj = {
  code          : "",
  customerIdDoc : "",
  customerName  : "",
  customerEmail : "",
  customerPhone : "",
  customerAddress: "",
  comment       : "",
  productList   : [],
  subTotal      : 0,
  iva           : 0,
  total         : 0,
  status        : 1
}

export const SalesOrderProvider = ({ children }) => {

  // * hooks
  const [obj, setObj] = useState(initObj);
  const [objList, dispatchObjList] = useReducer(tableReducer, []); // * reducer, init state, init function
  const [errors, setErrors] = useState({});
  const [showMessage, setShowMessage] = useState(false);
  const { fetchOrders/*, productList = [], loading, error*/ } = useSearchOrder();
  const { mutateOrder/*, data, loading, error*/ } = useUpdateOrder();
  const { mutateDeleteOrder/*, data, loading, error*/ } = useDeleteOrder();
  const [orderProductList, dispatchOrderProductList] = useReducer(tableReducer, []);

  useEffect(() => {
    if(orderProductList.length > 0 )
      setErrors({ ...errors, productList: "" });
    calculateTotals(orderProductList);
  }, [orderProductList]);

  // * handles
  const updateTable = (obj, actionType) => { // * obj can be a value or an array

    if(obj.length > 0)
      console.log(`updateTable: obj=(${obj.length}), actionType=${actionType}`);
    else console.log(`updateTable: obj=${JSON.stringify(obj)}, actionType=${actionType}`);

    const action = {
      type: actionType,
      payload: obj
    }

    dispatchObjList( action );
  }

  const updateForm = (obj = initObj) => {
    setObj(obj);
  }

  const cleanForm = () => {
    setObj(initObj);
    updateTableOrderProduct([], TableActionEnum.CLEAN);
    setErrors({});
  }

  // const calculateCost = (orderProductList) => {

  //   if(orderProductList.length === 0) return 0;

  //   const cost = orderProductList.reduce((acc, value) => {
  //     // alert(`calculateCost: cost=${value.cost}, active=${value.active}`);
  //     if(value.active){
  //       acc += parseFloat(value.cost) * parseFloat(value.qty);
  //     }
  //     return acc;
  //   }, 0);

  //   // alert(`calculateCost: cost=${cost}`);
  //   return cost;
  // }

  // const calculateProfitMargin = (obj) => {
  //   const cost = parseFloat(obj.cost) || 0;
  //   const price = parseFloat(obj.price) || 0;
  //   const profitMargin = ((price - cost) / price) * 100;
    
  //   if(profitMargin < 0) 
  //     return 0;

  //   return profitMargin;
  // }

  const updateTableOrderProduct = (obj, actionType) => { // * obj can be a value or an array
    const action = {
      type: actionType,
      payload: obj
    }

    dispatchOrderProductList( action );
  }

  const calculateTotals = (orderProductList) => {
    
    const subTotal = orderProductList.reduce((acc, value) => {
      if(value.status === 0)
        return acc;
      return acc + value.subTotal; // * acc only if status is 1=active
    }, 0);

    const iva = subTotal * 0.19; // TODO: parametrizar el iva
    const total = subTotal + iva;

    setObj({
      ...obj,
      productList: orderProductList,
      subTotal,
      iva,
      total
    })
  }
  
  // * api handles
  const findOrders = (name) => {

    const searchList = [name];

    return fetchOrders({ variables: { searchList } })
    .then(({ data }) => {
      const payload = data?.salesOrderFind?.payload || [];
      console.log(`findOrders: data=${JSON.stringify(payload)}`);
      return payload;
    })
    .catch((error) => {
      console.error('Error fetching sales:', error);
    });

  }

  const saveOrder = (obj) => {
    console.log(`saveOrder: obj=${JSON.stringify(obj)}`);
    
    const productListAux = obj.productList.map((value) => {
      return {
        id: value.id,
        name: value.name,
        cost: parseFloat(value.cost),
        price: parseFloat(value.price),
        qty: parseFloat(value.qty),
        status: value.status
      }
    });

    const objAux = {
      id              : obj.id ? obj.id : undefined,
      code            : obj.code ? obj.code : undefined,
      customerIdDoc   : obj.customerIdDoc,
      customerName    : obj.customerName,
      customerEmail   : obj.customerEmail,
      customerPhone   : obj.customerPhone,
      customerAddress : obj.customerAddress,
      comment         : obj.comment,
      status          : obj.status,
      productList     : productListAux
    }
    
    return mutateOrder({ variables: { product: objAux } })
    .then(({ data }) => {
      const payload = data?.salesOrderUpdate?.payload || [];
      return payload[0];
    })
    .catch((error) => {
      console.error('Error saving product:', error);
    });
  }

  const deleteOrder = (obj) => {
    
    return mutateDeleteOrder({ variables: { id: obj.id } })
    .then(({ data }) => {
      const payload = data?.salesOrderUpdate?.payload || [];
      return payload[0];
    })
    .catch((error) => {
      console.error('Error deleting product:', error);
    });
  }

  // * return component
  return (
    <SalesOrderContext.Provider 
      value={{ 
        obj, 
        objList, 
        errors, 
        showMessage, 
        
        updateTable, 
        updateForm, 
        cleanForm,
        updateTableOrderProduct, 
        setErrors, 
        setShowMessage,

        findOrders, 
        saveOrder, 
        deleteOrder
      }}>
      {children}
    </SalesOrderContext.Provider>
  )
}
