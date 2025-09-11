import type { FC } from "react";
import { useState, useEffect, useReducer, ReactNode } from 'react';
import moment from 'moment';

import { TableActionInterface, ScreenMessageInterface } from '../../../common/interfaces';
import { TableActionEnum, ScreenMessageTypeEnum } from '../../../common/enums';
import { tableReducer, tableReducerWithKey } from '../../../common/helpers';

import { SalesOrderInterface, SalesOrderProductInterface } from '../interfaces';
import { FormSalesOrderDto, FormSalesOrderProductDto, FormSalesOrderErrorDto, FormSalesOrderSearchDto } from '../dto';
import { SalesOrderStatusEnum, SalesOrderProductStatusEnum, SalesActionEnum } from '../enums';
import { useSearchOrder, useUpdateOrder } from '../graphql/useSalesOrder';
import { salesOrderContext } from './sales-order.context';


// * provider
const initFormSearch: FormSalesOrderSearchDto = {
  createdAtInit : moment().startOf('month').format('YYYY-MM-DD'),
  createdAtEnd  : moment().endOf('month').format('YYYY-MM-DD'),
  code          : '',
  customerNameIdDoc: '',
  comment       : '',
};

const initForm: FormSalesOrderDto = {
  id          : undefined,
  code          : undefined,
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
  status        : SalesOrderStatusEnum.NEW,
};

const initFormError: FormSalesOrderErrorDto = {
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
  
  const [formSearch, setFormSearch] = useState<FormSalesOrderSearchDto>(initFormSearch);
  const { fetchOrders }             = useSearchOrder();
  const [formList, dispatchFormList]= useReducer(tableReducer<FormSalesOrderDto>, []);

  const [isOpenOrderSection, setIsOpenOrderSection] = useState<boolean>(false);
  const [form, setForm]             = useState<FormSalesOrderDto>(initForm);
  const [formOrderProductList, dispatchFormOrderProductList] = useReducer(tableReducerWithKey<FormSalesOrderProductDto>, []);
  const { mutateOrder }             = useUpdateOrder();
  const [formError, setFormError]   = useState<FormSalesOrderErrorDto>(initFormError);
  
  const [actionList, setActionList]= useState<SalesActionEnum[]>([]);

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

  const updateTable = (actionType: TableActionEnum, payload?: FormSalesOrderDto | FormSalesOrderDto[]) => {
    
    const tableAction: TableActionInterface<FormSalesOrderDto> = {
      type: actionType,
      payload
    }

    dispatchFormList(tableAction);
  };

  const updateForm = (form: FormSalesOrderDto = initForm) => {
    setForm(form);
    updateTableOrderProduct(TableActionEnum.LOAD, form.productList);
  };

  const validate = (): boolean => {
    const newErrors: FormSalesOrderErrorDto = {};

    if (!form.customerName) newErrors.customerName = "Ingrese el nombre del cliente";
    if (form.productList.length === 0) newErrors.productList = "Ingrese uno ó más productos a la lista";

    setFormError(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const saveForm = () => {
    if (!validate()) return;

    // const status = form.status === SalesOrderStatusEnum.NEW ? SalesOrderStatusEnum.QUOTATION : form.status;

    // let formAux = {
    //   ...form, 
    //   status
    // }

    saveOrder(form)
    .then( (mutatedObj: SalesOrderInterface) => {
      const found = formList.find((value) => value.id === form.id);
      const actionType = found ? TableActionEnum.UPDATE : TableActionEnum.ADD;

      const formMutated: FormSalesOrderDto = {
        ...form,
        id: mutatedObj.id,
        code: formatCode(mutatedObj.code ?? 0),
        createdAt: mutatedObj.createdAt,
        status: mutatedObj.status
      };

      // cleanForm();
      updateForm(formMutated);
      updateTable(actionType, formMutated);
      setIsOpenOrderSection(true);
      setScreenMessage({ type: ScreenMessageTypeEnum.SUCCESS, title: "Información", message: "Guardado Exitoso!", show: true });
    })
    .catch(() => {
      setScreenMessage({ type: ScreenMessageTypeEnum.ERROR, title: "Problema", message: 'No se completó la operación, intente de nuevo', show: true });
    });
  };

  const saveFormStatus = (status: SalesOrderStatusEnum) => {
    if (!validate()) return;

    let formAux = {
      ...form, 
      status
    }

    saveOrder(formAux)
    .then( (mutatedObj: SalesOrderInterface) => {
      const found = formList.find((value) => value.id === form.id);
      const actionType = found ? TableActionEnum.UPDATE : TableActionEnum.ADD;

      const formMutated: FormSalesOrderDto = {
        ...formAux,
        id: mutatedObj.id,
        code: formatCode(mutatedObj.code ?? 0),
        createdAt: mutatedObj.createdAt,
      };

      // cleanForm();
      updateForm(formMutated);
      updateTable(actionType, formMutated);
      setIsOpenOrderSection(true);
      setScreenMessage({ type: ScreenMessageTypeEnum.SUCCESS, title: "Información", message: "Guardado Exitoso!", show: true });
    })
    .catch(() => {
      setScreenMessage({ type: ScreenMessageTypeEnum.ERROR, title: "Problema", message: 'No se completó la operación, intente de nuevo', show: true });
    });
  };

  const deleteForm = () => {
    const formAux = {
      ...form,
      status: SalesOrderStatusEnum.CANCELLED,
    };

    saveOrder(formAux)
    .then(() => {
      cleanForm();
      updateTable(TableActionEnum.DELETE, formAux);
      setIsOpenOrderSection(true);
      setScreenMessage({ type: ScreenMessageTypeEnum.SUCCESS, title: "Información", message: "Eliminación Exitosa!", show: true });
    })
    .catch(() => {
      setScreenMessage({ type: ScreenMessageTypeEnum.ERROR, title: "Problema", message: 'No se completó la operación, intente de nuevo', show: true });
    });
  };

  const saveOrder = (form: FormSalesOrderDto): Promise<SalesOrderInterface> => {

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
      code            : form.code ? Number(form.code) : undefined,
      customerIdDoc   : form.customerIdDoc,
      customerName    : form.customerName,
      customerEmail   : form.customerEmail,
      customerPhone   : form.customerPhone,
      customerAddress : form.customerAddress,
      comment         : form.comment,
      discount        : 0,
      discountPct     : 0,
      status          : form.status,
      productList     : productList
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
      console.error(`saveOrder: ${JSON.stringify(error)}`);
      console.error('saveOrder: Error', error);
      throw error;
    });
  };

  const updateTableOrderProduct = (actionType: TableActionEnum, payload?: FormSalesOrderProductDto | FormSalesOrderProductDto[]) => {

    const tableAction: TableActionInterface<FormSalesOrderProductDto> = {
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

  const calculateTotals = (formOrderProductList: FormSalesOrderProductDto[]) => {
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

  const formatCode = (code: number) => {
    if (!Number.isFinite(code)) 
      throw new Error('toCode5: value must be a finite number');

    let formattedCode = String(code);
    if (code < 100000)
      formattedCode = String(code).padStart(6, '0');

    return formattedCode;
  }

  return (
    <salesOrderContext.Provider
      value={{
        formSearch,
        formList,
        setFormSearch,
        searchOrders,
        updateTable,

        actionList,
        setActionList,
        
        isOpenOrderSection,
        form,
        formError,
        setIsOpenOrderSection,
        updateForm,
        updateTableOrderProduct,
        // saveOrder,
        saveFormStatus,
        saveForm,
        deleteForm,
        setFormError,
        cleanForm,

        screenMessage,
        setScreenMessage,
        resetScreenMessage,
        formatCode
      }}
    >
      {children}
    </salesOrderContext.Provider>
  );
};
