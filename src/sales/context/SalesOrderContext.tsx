import type { FC } from "react";
import { useState, useEffect, useReducer, ReactNode, createContext } from 'react';

import { TableActionInterface, ScreenMessageInterface } from '../../common/interfaces';
import { TableActionEnum } from '../../common/enums/table-actions.enum';
import { ScreenMessageTypeEnum } from '../../common/enums/screen-message-type-enum';
import { tableReducer, tableReducerWithKey } from '../../common/helpers';

import { FormSalesOrderSearchInterface, FormSalesOrderInterface, FormSalesOrderProductInterface, FormSalesOrderErrorInterface, SalesOrderInterface } from '../interfaces';
import { SalesOrderStatusEnum } from '../enums/sales-order-status.enum';
import { useSearchOrder, useUpdateOrder } from '../hooks/useSalesOrder';
import { SalesOrderProductStatusEnum } from '../enums/sales-order-product-status.enum';

// * context
interface SalesOrderContextType {
  objSearch   : FormSalesOrderSearchInterface;
  objList     : FormSalesOrderInterface[];
  setObjSearch: (formSearch: FormSalesOrderSearchInterface) => void;
  searchOrders: (createdAtInit?: string, createdAtEnd?: string, code?: string, customerNameIdDoc?: string, comment?: string) => Promise<SalesOrderInterface[]>;
  updateTable : (actionType: TableActionEnum, payload?: FormSalesOrderInterface | FormSalesOrderInterface[]) => void;

  obj         : FormSalesOrderInterface;
  formError   : FormSalesOrderErrorInterface;
  updateForm  : (form: FormSalesOrderInterface) => void;
  updateTableOrderProduct: (actionType: TableActionEnum, payload?: FormSalesOrderProductInterface | FormSalesOrderProductInterface[]) => void;
  saveOrder   : (obj: FormSalesOrderInterface) => Promise<SalesOrderInterface>;
  setFormError: (formError: FormSalesOrderErrorInterface) => void;
  cleanForm   : () => void;
  
  screenMessage: ScreenMessageInterface;
  setScreenMessage: (msg: ScreenMessageInterface) => void;
  resetScreenMessage: () => void;
}

export const SalesOrderContext = createContext<SalesOrderContextType | undefined>(undefined);


// * provider
const initFormSearch: FormSalesOrderSearchInterface = {
  createdAtInit : '',
  createdAtEnd  : '',
  code          : '',
  customerNameIdDoc: '',
  comment       : '',
};

const initForm: FormSalesOrderInterface = {
  code          : '',
  customerIdDoc : '',
  customerName  : '',
  customerEmail : '',
  customerPhone : '',
  customerAddress: '',
  comment       : '',
  productList   : [],
  subTotal      : 0,
  iva           : 0,
  total         : 0,
  createdAt     : '',
  status        : SalesOrderStatusEnum.IN_PROGRESS,
};

const initFormError: FormSalesOrderErrorInterface = {
  customerName: '',
  productList : ''
};

const initScreenMessage: ScreenMessageInterface = {
  type: ScreenMessageTypeEnum.SUCCESS,
  title: '',
  message: '',
  show: false,
};

interface Props {
  children: ReactNode;
}

export const SalesOrderProvider: FC<Props> = ({ children }) => {
  
  const [objSearch, setObjSearch]   = useState<FormSalesOrderSearchInterface>(initFormSearch);
  const { fetchOrders } = useSearchOrder();
  const [objList, dispatchObjList]  = useReducer(tableReducer<FormSalesOrderInterface>, []);

  const [obj, setObj]               = useState<FormSalesOrderInterface>(initForm);
  const [orderProductList, dispatchOrderProductList] = useReducer(tableReducerWithKey<FormSalesOrderProductInterface>, []);
  const { mutateOrder }             = useUpdateOrder();
  const [formError, setFormError]   = useState<FormSalesOrderErrorInterface>(initFormError);
  
  const [screenMessage, setScreenMessage] = useState<ScreenMessageInterface>(initScreenMessage);

  useEffect(() => {
    if (orderProductList.length > 0) {
      setFormError({ ...formError, productList: '' });
    }
    calculateTotals(orderProductList);
  }, [orderProductList]);


  const searchOrders = (
    createdAtInit?     : string,
    createdAtEnd?      : string,
    code?              : string,
    customerNameIdDoc? : string,
    comment?           : string
  ): Promise<SalesOrderInterface[]> => {

    return fetchOrders({ variables: { createdAtInit, createdAtEnd, code, customerNameIdDoc, comment } })
    .then( (response) => {

      const { salesOrderSearchByValues } = response.data || {};
      const { internalCode = 0, message, payload = [] } = salesOrderSearchByValues || {};

      if (![200, 400, 404].includes(internalCode)) {
        throw new Error(message);
      }

      return payload;
    })
    .catch((error: any) => {
      console.error('Error searchOrders:', error);
      throw error;
    });

  };

  const updateTable = (actionType: TableActionEnum, payload?: FormSalesOrderInterface | FormSalesOrderInterface[]) => {
    
    const tableAction: TableActionInterface<FormSalesOrderInterface> = {
      type: actionType,
      payload
    }

    dispatchObjList(tableAction);
  };


  const updateForm = (form: FormSalesOrderInterface = initForm) => {
    setObj(form);
    updateTableOrderProduct(TableActionEnum.LOAD, form.productList);
  };

  const saveOrder = (form: FormSalesOrderInterface): Promise<SalesOrderInterface> => {

    const productListAux = form.productList.map( (value) => ({
      id      : value.id,
      qty     : parseFloat(value.qty.toString()),
      comment : value.comment || undefined,
      name    : value.name,
      code    : value.code || undefined,
      cost    : parseFloat(value.cost.toString()),
      price   : parseFloat(value.price.toString()),
      status  : value.status
    }) );

    const objAux = {
      id              : form.id || undefined,
      code            : form.code || undefined,
      customerIdDoc   : form.customerIdDoc,
      customerName    : form.customerName,
      customerEmail   : form.customerEmail,
      customerPhone   : form.customerPhone,
      customerAddress : form.customerAddress,
      comment         : form.comment,
      status          : form.status,
      productList     : productListAux
    };

    return mutateOrder({ variables: { input: objAux } })
    .then( (response) => {
      
      const { salesOrderUpdate } = response.data || {};
      const { internalCode = 0, message, payload = [] } = salesOrderUpdate || {};

      if (![200, 400, 404].includes(internalCode)) {
        throw new Error(message);
      }

      if(payload.length === 0) {
        throw new Error('no value was returned');
      }

      return payload[0];
    })
    .catch((error: any) => {
      console.error('saveOrder: Error', error);
      throw error;
    });
  };

  const updateTableOrderProduct = (actionType: TableActionEnum, payload?: FormSalesOrderProductInterface | FormSalesOrderProductInterface[]) => {

    const tableAction: TableActionInterface<FormSalesOrderProductInterface> = {
      type: actionType,
      payload
    }

    dispatchOrderProductList(tableAction);
  };

  const calculateTotals = (orderProductList: FormSalesOrderProductInterface[]) => {
    const subTotal = orderProductList.reduce((acc, value) => {
      if (value.status === SalesOrderProductStatusEnum.CANCELLED)
        return acc;
      
      return acc + value.subTotal;
    }, 0);

    const iva = subTotal * 0.19; // TODO: el iva debe ser configurable y debe estar en la tabla adm_companies y debe llegar la informacion del login
    const total = subTotal + iva;

    setObj({
      ...obj,
      productList: orderProductList,
      subTotal,
      iva,
      total,
    });
  };

  const cleanForm = () => {
    setObj(initForm);
    updateTableOrderProduct(TableActionEnum.CLEAN, []);
    setFormError(initFormError);
  };


  const resetScreenMessage = () => setScreenMessage(initScreenMessage);

  return (
    <SalesOrderContext.Provider
      value={{
        objSearch,
        objList,
        setObjSearch,
        searchOrders,
        updateTable,

        obj,
        formError,
        updateForm,
        updateTableOrderProduct,
        saveOrder,
        setFormError,
        cleanForm,

        screenMessage,
        setScreenMessage,
        resetScreenMessage,
      }}
    >
      {children}
    </SalesOrderContext.Provider>
  );
};
