import type { FC } from "react";
import { useState, useEffect, useReducer, ReactNode, createContext } from 'react';

import { TableActionInterface, ScreenMessageInterface } from '../../../common/interfaces';
import { TableActionEnum, ScreenMessageTypeEnum } from '../../../common/enums';
import { tableReducer, tableReducerWithKey } from '../../../common/helpers';

import { FormSalesOrderSearchInterface, FormSalesOrderInterface, FormSalesOrderProductInterface, FormSalesOrderErrorInterface, SalesOrderInterface, SalesOrderProductInterface } from '../interfaces';
import { SalesOrderStatusEnum, SalesOrderProductStatusEnum } from '../enums';
import { useSearchOrder, useUpdateOrder } from '../graphql/useSalesOrder';

// * context
interface SalesOrderContextType {
  formSearch    : FormSalesOrderSearchInterface;
  formList      : FormSalesOrderInterface[];
  setFormSearch : (formSearch: FormSalesOrderSearchInterface) => void;
  searchOrders  : (createdAtInit?: string, createdAtEnd?: string, code?: string, customerNameIdDoc?: string, comment?: string) => Promise<SalesOrderInterface[]>;
  updateTable   : (actionType: TableActionEnum, payload?: FormSalesOrderInterface | FormSalesOrderInterface[]) => void;

  form        : FormSalesOrderInterface;
  formError   : FormSalesOrderErrorInterface;
  updateForm  : (form: FormSalesOrderInterface) => void;
  updateTableOrderProduct: (actionType: TableActionEnum, payload?: FormSalesOrderProductInterface | FormSalesOrderProductInterface[]) => void;
  saveOrder   : (form: FormSalesOrderInterface) => Promise<SalesOrderInterface>;
  setFormError: (formError: FormSalesOrderErrorInterface) => void;
  cleanForm   : () => void;
  
  screenMessage     : ScreenMessageInterface;
  setScreenMessage  : (msg: ScreenMessageInterface) => void;
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
  id          : undefined,
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
  type    : ScreenMessageTypeEnum.SUCCESS,
  title   : '',
  message : '',
  show    : false,
};

interface Props {
  children: ReactNode;
}

export const SalesOrderProvider: FC<Props> = ({ children }) => {
  
  const [formSearch, setFormSearch]   = useState<FormSalesOrderSearchInterface>(initFormSearch);
  const { fetchOrders } = useSearchOrder();
  const [formList, dispatchFormList]  = useReducer(tableReducer<FormSalesOrderInterface>, []);

  const [form, setForm]               = useState<FormSalesOrderInterface>(initForm);
  const [formOrderProductList, dispatchFormOrderProductList] = useReducer(tableReducerWithKey<FormSalesOrderProductInterface>, []);
  const { mutateOrder }             = useUpdateOrder();
  const [formError, setFormError]   = useState<FormSalesOrderErrorInterface>(initFormError);
  
  const [screenMessage, setScreenMessage] = useState<ScreenMessageInterface>(initScreenMessage);

  useEffect(() => {
    if (formOrderProductList.length > 0) {
      setFormError({ ...formError, productList: '' });
    }
    calculateTotals(formOrderProductList);
  }, [formOrderProductList]);


  const searchOrders = (createdAtInit?: string, createdAtEnd?: string, code?: string, customerNameIdDoc?: string, comment?: string): Promise<SalesOrderInterface[]> => {

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

    dispatchFormList(tableAction);
  };

  const updateForm = (form: FormSalesOrderInterface = initForm) => {
    setForm(form);
    updateTableOrderProduct(TableActionEnum.LOAD, form.productList);
  };

  const saveOrder = (form: FormSalesOrderInterface): Promise<SalesOrderInterface> => {

    const productList: SalesOrderProductInterface[] = form.productList.map( (value) => ({
      id      : value.id,
      qty     : parseFloat(value.qty.toString()),
      comment : value.comment || undefined,
      name    : value.name,
      code    : value.code || undefined,
      cost    : value.cost,
      price   : value.price,
      discount: 0,
      discountPct: value.discountPct,
      status  : value.status
    }) );

    const obj: SalesOrderInterface = {
      id              : form.id || undefined,
      code            : form.code || undefined,
      customerIdDoc   : form.customerIdDoc,
      customerName    : form.customerName,
      customerEmail   : form.customerEmail,
      customerPhone   : form.customerPhone,
      customerAddress : form.customerAddress,
      comment         : form.comment,
      discount        : 0,
      discountPct     : 0,
      status          : form.status,
      productList     : productList,
      cost            : 0,
      price           : 0,
    };

    return mutateOrder({ variables: { input: obj } })
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

    dispatchFormOrderProductList(tableAction);
  };

  const cleanForm = () => {
    setForm(initForm);
    updateTableOrderProduct(TableActionEnum.CLEAN, []);
    setFormError(initFormError);
  };

  const resetScreenMessage = () => setScreenMessage(initScreenMessage);

  const calculateTotals = (formOrderProductList: FormSalesOrderProductInterface[]) => {
    const subTotal = formOrderProductList.reduce((acc, value) => {
      if (value.status === SalesOrderProductStatusEnum.CANCELLED)
        return acc;
      
      return acc + value.subTotal;
    }, 0);

    const iva = subTotal * 0.19; // TODO: el iva debe ser configurable y debe estar en la tabla adm_companies y debe llegar la informacion del login
    const total = subTotal + iva;

    setForm({
      ...form,
      productList: formOrderProductList,
      subTotal,
      iva,
      total,
    });
  };

  return (
    <SalesOrderContext.Provider
      value={{
        formSearch,
        formList,
        setFormSearch,
        searchOrders,
        updateTable,

        form,
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
