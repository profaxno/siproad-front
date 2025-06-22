import type { FC } from "react";
import { useState, useEffect, useReducer, ReactNode, createContext } from 'react';
import moment from 'moment';

import { TableActionInterface, ScreenMessageInterface } from '../../../common/interfaces';
import { TableActionEnum, ScreenMessageTypeEnum } from '../../../common/enums';
import { tableReducer, tableReducerWithKey } from '../../../common/helpers';

import { FormPurchasesOrderSearchInterface, FormPurchasesOrderInterface, FormPurchasesOrderProductInterface, FormPurchasesOrderErrorInterface, PurchasesOrderInterface, PurchasesOrderProductInterface } from '../interfaces';
import { PurchasesOrderStatusEnum, PurchasesOrderProductStatusEnum } from '../enums';
import { useSearchOrder, useUpdateOrder } from '../graphql/usePurchasesOrder';
import { PurchasesTypeInterface } from "../interfaces/purchases-type.interface";
import { DocumentTypeInterface } from "../interfaces/purchases-document-type.interface";
import { useSearchType } from "../graphql/usePurchasesType";

// * context
interface PurchasesOrderContextType {
  formSearch    : FormPurchasesOrderSearchInterface;
  formList      : FormPurchasesOrderInterface[];
  setFormSearch : (formSearch: FormPurchasesOrderSearchInterface) => void;
  searchOrders  : (createdAtInit?: string, createdAtEnd?: string, code?: string, providerNameIdDoc?: string, comment?: string) => Promise<PurchasesOrderInterface[]>;
  updateTable   : (actionType: TableActionEnum, payload?: FormPurchasesOrderInterface | FormPurchasesOrderInterface[]) => void;

  isOpenOrderSection: boolean;
  form        : FormPurchasesOrderInterface;
  formError   : FormPurchasesOrderErrorInterface;
  setIsOpenOrderSection: (isOpenOrderSection: boolean) => void; 
  updateForm  : (form: FormPurchasesOrderInterface) => void;
  updateTableOrderProduct: (actionType: TableActionEnum, payload?: FormPurchasesOrderProductInterface | FormPurchasesOrderProductInterface[]) => void;
  //saveOrder   : (form: FormPurchasesOrderInterface) => Promise<PurchasesOrderInterface>;
  
  // validate    : () => boolean;
  saveForm      : () => void;
  saveFormStatus: (status: PurchasesOrderStatusEnum) => void;
  deleteForm    : () => void;
  setFormError  : (formError: FormPurchasesOrderErrorInterface) => void;
  cleanForm     : () => void;
  
  screenMessage     : ScreenMessageInterface;
  setScreenMessage  : (msg: ScreenMessageInterface) => void;
  resetScreenMessage: () => void;

  searchPurchaseTypes: () => Promise<PurchasesTypeInterface[]>;
  searchDocumentTypes: () => Promise<DocumentTypeInterface[]>;
}

export const PurchasesOrderContext = createContext<PurchasesOrderContextType | undefined>(undefined);


// * provider
const initFormSearch: FormPurchasesOrderSearchInterface = {
  createdAtInit : moment().format('YYYY-MM-DD'),
  createdAtEnd  : '',
  code          : '',
  providerNameIdDoc: '',
  comment       : '',
};

const initForm: FormPurchasesOrderInterface = {
  id            : undefined,
  code          : undefined,
  purchaseTypeId: undefined,
  documentTypeId: undefined,
  providerIdDoc : undefined,
  providerName  : '',
  providerEmail : undefined,
  providerPhone : undefined,
  providerAddress: undefined,
  comment       : undefined,
  amount        : 0,
  documentNumber: undefined,
  productList   : [],
  createdAt     : '',
  status        : PurchasesOrderStatusEnum.NEW,
  total         : 0
};

const initFormError: FormPurchasesOrderErrorInterface = {
  providerName: '',
  amount: 0,
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

export const PurchasesOrderProvider: FC<Props> = ({ children }) => {
  
  const [formSearch, setFormSearch] = useState<FormPurchasesOrderSearchInterface>(initFormSearch);
  const { fetchOrders }             = useSearchOrder();
  const [formList, dispatchFormList]= useReducer(tableReducer<FormPurchasesOrderInterface>, []);

  const [isOpenOrderSection, setIsOpenOrderSection] = useState<boolean>(false);
  const [form, setForm]             = useState<FormPurchasesOrderInterface>(initForm);
  const [formOrderProductList, dispatchFormOrderProductList] = useReducer(tableReducerWithKey<FormPurchasesOrderProductInterface>, []);
  const { fetchTypes }              = useSearchType();
  const { mutateOrder }             = useUpdateOrder();
  const [formError, setFormError]   = useState<FormPurchasesOrderErrorInterface>(initFormError);
  
  const [screenMessage, setScreenMessage] = useState<ScreenMessageInterface>(initScreenMessage);

  useEffect(() => {
    if (formOrderProductList.length > 0) {
      setFormError({ ...formError, productList: '' });
    }
    calculateTotals(formOrderProductList);
  }, [formOrderProductList]);


  const searchOrders = (createdAtInit?: string, createdAtEnd?: string, code?: string, providerNameIdDoc?: string, comment?: string): Promise<PurchasesOrderInterface[]> => {

    return fetchOrders({ variables: { createdAtInit, createdAtEnd, code, providerNameIdDoc, comment } })
    .then( (response) => {

      const { purchasesOrderSearchByValues } = response.data || {};
      const { internalCode = 0, message, payload = [] } = purchasesOrderSearchByValues || {};

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

  const updateTable = (actionType: TableActionEnum, payload?: FormPurchasesOrderInterface | FormPurchasesOrderInterface[]) => {
    
    const tableAction: TableActionInterface<FormPurchasesOrderInterface> = {
      type: actionType,
      payload
    }

    dispatchFormList(tableAction);
  };

  const updateForm = (form: FormPurchasesOrderInterface = initForm) => {
    setForm(form);
    updateTableOrderProduct(TableActionEnum.LOAD, form.productList);
  };

  const validate = (): boolean => {
    const newErrors: FormPurchasesOrderErrorInterface = {};

    if (!form.providerName) newErrors.providerName = "Ingrese el nombre del cliente";
    if (!form.purchaseTypeId) newErrors.purchaseTypeId = "Seleccione el tipo de gasto";
    // if (form.productList.length === 0) newErrors.productList = "Ingrese uno ó más productos a la lista";

    setFormError(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const saveForm = () => {
    if (!validate()) return;

    saveOrder(form)
    .then( (mutatedObj: PurchasesOrderInterface) => {
      const found = formList.find((value) => value.id === form.id);
      const actionType = found ? TableActionEnum.UPDATE : TableActionEnum.ADD;

      const formMutated: FormPurchasesOrderInterface = {
        ...form,
        id: mutatedObj.id,
        code: mutatedObj.code,
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

  const saveFormStatus = (status: PurchasesOrderStatusEnum) => {
    if (!validate()) return;

    let formAux = {
      ...form, 
      status
    }

    saveOrder(formAux)
    .then( (mutatedObj: PurchasesOrderInterface) => {
      const found = formList.find((value) => value.id === form.id);
      const actionType = found ? TableActionEnum.UPDATE : TableActionEnum.ADD;

      const formMutated: FormPurchasesOrderInterface = {
        ...formAux,
        id: mutatedObj.id,
        code: mutatedObj.code,
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
      status: PurchasesOrderStatusEnum.CANCELLED,
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

  const saveOrder = (form: FormPurchasesOrderInterface): Promise<PurchasesOrderInterface> => {
    console.log(JSON.stringify(form));
    
    const productList: PurchasesOrderProductInterface[] = form.productList.map( (value) => ({
      id      : value.id,
      qty     : parseFloat(value.qty.toString()),
      comment : value.comment || undefined,
      name    : value.name,
      code    : value.code || undefined,
      cost    : value.cost,
      amount  : value.amount,
      updateProductCost: value.updateProductCost,
      status  : value.status
    }) );

    const obj: PurchasesOrderInterface = {
      id              : form.id || undefined,
      code            : form.code || undefined,
      purchaseTypeId  : form.purchaseTypeId,
      documentTypeId  : form.documentTypeId,
      providerIdDoc   : form.providerIdDoc,
      providerName    : form.providerName,
      providerEmail   : form.providerEmail,
      providerPhone   : form.providerPhone,
      providerAddress : form.providerAddress,
      comment         : form.comment,
      amount          : form.amount,
      documentNumber  : form.documentNumber,
      productList     : productList,
      status          : form.status
    };

    return mutateOrder({ variables: { order: obj } })
    .then( (response) => {
      
      const { purchasesOrderUpdate } = response.data || {};
      const { internalCode = 0, message, payload = [] } = purchasesOrderUpdate || {};

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

  const updateTableOrderProduct = (actionType: TableActionEnum, payload?: FormPurchasesOrderProductInterface | FormPurchasesOrderProductInterface[]) => {

    const tableAction: TableActionInterface<FormPurchasesOrderProductInterface> = {
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

  const calculateTotals = (formOrderProductList: FormPurchasesOrderProductInterface[]) => {
    const total = formOrderProductList.reduce((acc, value) => {
      if (value.status === PurchasesOrderProductStatusEnum.CANCELLED)
        return acc;
      
      return acc + value.amount;
    }, 0);

    setForm({
      ...form,
      productList: formOrderProductList,
      total
    });
  };

  const searchPurchaseTypes = (name?: string): Promise<PurchasesTypeInterface[]> => {

    // const datosSimulados: PurchasesTypeInterface[] = [
    //   { id: 'aaaaaaaaaa1', name: 'Variables' },
    //   { id: 'bbbbbbbbbb2', name: 'Fijo' },
    // ];

    // return Promise.resolve(datosSimulados);
    

    return fetchTypes({ variables: { name } })
    .then( (response) => {

      const { purchasesTypeSearchByValues } = response.data || {};
      const { internalCode = 0, message, payload = [] } = purchasesTypeSearchByValues || {};

      if (![200, 400, 404].includes(internalCode)) {
        throw new Error(message);
      }

      return payload;
    })
    .catch((error: any) => {
      console.error('Error searchPurchaseTypes:', error);
      throw error;
    });

  };

  const searchDocumentTypes = (): Promise<DocumentTypeInterface[]> => {

    const datosSimulados: DocumentTypeInterface[] = [
      { id: 'aaaaaaaaaa1', name: 'Boleta' },
      { id: 'bbbbbbbbbb2', name: 'Factura' }
    ];

    return Promise.resolve(datosSimulados);
    

    // return fetchOrders({ variables: { createdAtInit, createdAtEnd, code, providerNameIdDoc, comment } })
    // .then( (response) => {

    //   const { purchasesOrderSearchByValues } = response.data || {};
    //   const { internalCode = 0, message, payload = [] } = purchasesOrderSearchByValues || {};

    //   if (![200, 400, 404].includes(internalCode)) {
    //     throw new Error(message);
    //   }

    //   return payload;
    // })
    // .catch((error: any) => {
    //   console.error('Error searchOrders:', error);
    //   throw error;
    // });

  };

  return (
    <PurchasesOrderContext.Provider
      value={{
        formSearch,
        formList,
        setFormSearch,
        searchOrders,
        updateTable,

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

        searchPurchaseTypes,
        searchDocumentTypes
      }}
    >
      {children}
    </PurchasesOrderContext.Provider>
  );
};
