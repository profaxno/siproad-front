import { useState, useEffect, useReducer } from 'react'

// import * as moment from 'moment-timezone';
import moment from 'moment-timezone';

import { SalesOrderContext } from './SalesOrderContext';

import { DateEnum } from '../../common/enums/date.enum';
import { TableActionEnum } from '../../common/enums/table-actions.enum';
import { tableReducer } from '../../common/helpers/TableReducer'
import { searchResultsTableReducer } from '../../common/helpers/SearchResultsTableReducer';

import { useSearchOrder, useUpdateOrder } from '../hooks/useSalesOrder';

const initObjSearch = {
  createdAtInit     : "", // moment().format(DateEnum.DATE_FORMAT),
  createdAtEnd      : "", // moment().add(1, 'days').format(DateEnum.DATE_FORMAT),
  code              : "",
  customerNameIdDoc : "",
  comment           : ""
}

const initObj = {
  code            : "",
  customerIdDoc   : "",
  customerName    : "",
  customerEmail   : "",
  customerPhone   : "",
  customerAddress : "",
  comment         : "",
  productList     : [],
  subTotal        : 0,
  iva             : 0,
  total           : 0,
  status          : 1
}

const initScreenMessage = {
  type    : "", // "success", "error", "info"
  title   : "",
  message : "",
  show    : false
}  

export const SalesOrderProvider = ({ children }) => {

  // * hooks
  const [obj, setObj] = useState(initObj);
  const [objSearch, setObjSearch] = useState(initObjSearch);
  const [objList, dispatchObjList] = useReducer(searchResultsTableReducer, []); // * reducer, init state, init function
  const [errors, setErrors] = useState({});
  const [screenMessage, setScreenMessage] = useState(initScreenMessage);
  const { fetchOrders/*, productList = [], loading, error*/ } = useSearchOrder();
  const { mutateOrder/*, data, loading, error*/ } = useUpdateOrder();
  // const { mutateDeleteOrder/*, data, loading, error*/ } = useDeleteOrder();
  const [orderProductList, dispatchOrderProductList] = useReducer(tableReducer, []);

  useEffect(() => {
    if(orderProductList.length > 0 )
      setErrors({ ...errors, productList: "" });
    calculateTotals(orderProductList);
  }, [orderProductList]);

  // * handles
  const updateTable = (obj, actionType) => { // * obj can be a value or an array
    // alert(`updateTable: obj=${JSON.stringify(obj)}, actionType=${actionType}`);
    
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
  
  const resetScreenMessage = () => {
    setScreenMessage(initScreenMessage);
  }

  // * api handles
  const searchOrders = (createdAtInit, createdAtEnd, code, customerNameIdDoc, comment) => {

    return fetchOrders({ variables: { createdAtInit, createdAtEnd, code, customerNameIdDoc, comment } })
    .then(({ data }) => {
      
      const { internalCode, message, payload } = data?.salesOrderSearchByValues || {};

      if( !(
        internalCode == 200 ||
        internalCode == 400 ||
        internalCode == 404)
      ) {
        throw new Error(message);
      }

      return payload || [];
    })
    .catch((error) => {
      console.error('Error searchOrders:', error);
      throw error;
    });

  }

  const saveOrder = (obj) => {
    // console.log(`saveOrder: obj=${JSON.stringify(obj)}`);
    
    const productListAux = obj.productList.map((value) => {
      return {
        id      : value.id,
        qty     : parseFloat(value.qty),
        comment : value.comment ? value.comment : undefined,
        name    : value.name,
        code    : value.code ? value.code : undefined,
        cost    : parseFloat(value.cost),
        price   : parseFloat(value.price),
        status  : value.status
      }
    });

    const objAux = {
      id              : obj.id    ? obj.id    : undefined,
      code            : obj.code  ? obj.code  : undefined,
      customerIdDoc   : obj.customerIdDoc,
      customerName    : obj.customerName,
      customerEmail   : obj.customerEmail,
      customerPhone   : obj.customerPhone,
      customerAddress : obj.customerAddress,
      comment         : obj.comment,
      status          : obj.status,
      productList     : productListAux
    }
    
    return mutateOrder({ variables: { input: objAux } })
    .then(({ data }) => {

      const { internalCode, message, payload } = data?.salesOrderUpdate || {};
      
      if( !(
        internalCode == 200 ||
        internalCode == 400 ||
        internalCode == 404)
      ) {
        throw new Error(message);
      }

      return payload ? payload[0] : null;
    })
    .catch((error) => {
      console.error('Error saveOrder:', error);
      throw error;
    });
  }

  // const deleteOrder = (obj) => {
    
  //   return mutateDeleteOrder({ variables: { id: obj.id } })
  //   .then(({ data }) => {
  //     const payload = data?.salesOrderDelete?.payload || [];
  //     return payload[0];
  //   })
  //   .catch((error) => {
  //     console.error('Error deleting product:', error);
  //   });
  // }

  // * return component
  return (
    <SalesOrderContext.Provider 
      value={{ 
        obj,
        objSearch,
        objList, 
        errors, 
        // showMessage, 
        screenMessage, 
        
        updateTable, 
        updateForm, 
        cleanForm,
        updateTableOrderProduct, 
        setErrors, 
        // setShowMessage,
        setScreenMessage,
        resetScreenMessage,

        setObjSearch,
        searchOrders,
        saveOrder
      }}>
      {children}
    </SalesOrderContext.Provider>
  )
}
