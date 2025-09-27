import type { FC } from "react";
import { useState, useEffect, useReducer, ReactNode } from 'react';
import moment from 'moment';

import { TableActionInterface, ScreenMessageInterface } from '../../../common/interfaces';
import { TableActionEnum, ScreenMessageTypeEnum } from '../../../common/enums';
import { tableReducer, tableReducerWithKey } from '../../../common/helpers';

import { PurchasesOrderInterface, PurchasesOrderProductInterface } from '../interfaces';
import { FormPurchasesOrderSearchDto, FormPurchasesOrderDto, FormPurchasesOrderProductDto, FormPurchasesOrderErrorDto } from '../dto';
import { PurchasesOrderStatusEnum, PurchasesOrderProductStatusEnum, PurchasesActionEnum } from '../enums';
import { useSearchOrder, useUpdateOrder } from '../graphql/usePurchasesOrder';
import { purchasesOrderContext } from './purchases-order.context';

// * provider
const initFormSearch: FormPurchasesOrderSearchDto = {
  createdAtInit : moment().startOf('month').format('YYYY-MM-DD'),
  createdAtEnd  : moment().endOf('month').format('YYYY-MM-DD'),
  code          : '',
  providerNameIdDoc: '',
  comment       : '',
};

const initForm: FormPurchasesOrderDto = {
  id            : undefined,
  code          : undefined,
  providerName  : '',
  providerIdDoc : undefined,
  providerEmail : undefined,
  providerPhone : undefined,
  providerAddress: undefined,
  comment       : undefined,
  amount        : 0,
  documentTypeId: undefined,
  documentNumber: undefined,
  purchaseTypeId: undefined,
  productList   : [],
  total         : 0,
  createdAt     : '',
  status        : PurchasesOrderStatusEnum.NEW,
};

const initFormError: FormPurchasesOrderErrorDto = {
  providerName: '',
  amount: '',
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
  
  const [formSearch, setFormSearch] = useState<FormPurchasesOrderSearchDto>(initFormSearch);
  const { fetchOrders }             = useSearchOrder();
  const [formList, dispatchFormList]= useReducer(tableReducer<FormPurchasesOrderDto>, []);

  const [isOpenFormSection, setIsOpenFormSection] = useState<boolean>(false);
  const [form, setForm]             = useState<FormPurchasesOrderDto>(initForm);
  const [formOrderProductList, dispatchFormOrderProductList] = useReducer(tableReducerWithKey<FormPurchasesOrderProductDto>, []);
  const { mutateOrder }             = useUpdateOrder();
  const [formError, setFormError]   = useState<FormPurchasesOrderErrorDto>(initFormError);
  
  const [actionList, setActionList]= useState<PurchasesActionEnum[]>([]);

  const [screenMessage, setScreenMessage] = useState<ScreenMessageInterface>(initScreenMessage);

  useEffect(() => {
    if (formOrderProductList.length > 0) {
      setFormError({ ...formError, productList: '' });
    }
    calculateTotals(formOrderProductList);
  }, [formOrderProductList]);


  const search = (createdAtInit?: string, createdAtEnd?: string, code?: string, providerNameIdDoc?: string, comment?: string): Promise<PurchasesOrderInterface[]> => {

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
      console.error('Error search:', error);
      throw error;
    });

  };

  const updateTable = (actionType: TableActionEnum, payload?: FormPurchasesOrderDto | FormPurchasesOrderDto[]) => {
    
    const tableAction: TableActionInterface<FormPurchasesOrderDto> = {
      type: actionType,
      payload
    }

    dispatchFormList(tableAction);
  };

  const updateForm = (form: FormPurchasesOrderDto = initForm) => {
    setForm(form);
    updateTableOrderProduct(TableActionEnum.LOAD, form.productList);
  };

  const updateTableOrderProduct = (actionType: TableActionEnum, payload?: FormPurchasesOrderProductDto | FormPurchasesOrderProductDto[]) => {

    const tableAction: TableActionInterface<FormPurchasesOrderProductDto> = {
      type: actionType,
      payload
    }

    dispatchFormOrderProductList(tableAction);
  };

  const saveForm = () => {
    if (!validate()) return;

    save(form)
    .then( (mutatedObj: PurchasesOrderInterface) => {
      const found = formList.find((value) => value.id === form.id);
      const actionType = found ? TableActionEnum.UPDATE : TableActionEnum.ADD;

      const formMutated: FormPurchasesOrderDto = {
        ...form,
        id: mutatedObj.id,
        code: formatCode(mutatedObj.code ?? 0),
        createdAt: mutatedObj.createdAt,
        status: mutatedObj.status
      };

      // cleanForm();
      updateForm(formMutated);
      updateTable(actionType, formMutated);
      setIsOpenFormSection(true);
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

    save(formAux)
    .then( (mutatedObj: PurchasesOrderInterface) => {
      const found = formList.find((value) => value.id === form.id);
      const actionType = found ? TableActionEnum.UPDATE : TableActionEnum.ADD;

      const formMutated: FormPurchasesOrderDto = {
        ...formAux,
        id: mutatedObj.id,
        code: formatCode(mutatedObj.code ?? 0),
        createdAt: mutatedObj.createdAt,
        status: mutatedObj.status
      };

      // cleanForm();
      updateForm(formMutated);
      updateTable(actionType, formMutated);
      setIsOpenFormSection(true);
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

    save(formAux)
    .then(() => {
      cleanForm();
      updateTable(TableActionEnum.DELETE, formAux);
      setIsOpenFormSection(true);
      setScreenMessage({ type: ScreenMessageTypeEnum.SUCCESS, title: "Información", message: "Eliminación Exitosa!", show: true });
    })
    .catch(() => {
      setScreenMessage({ type: ScreenMessageTypeEnum.ERROR, title: "Problema", message: 'No se completó la operación, intente de nuevo', show: true });
    });
  };

  const cleanForm = () => {
    setForm(initForm);
    updateTableOrderProduct(TableActionEnum.CLEAN, []);
    setFormError(initFormError);
  };

  const resetScreenMessage = () => setScreenMessage(initScreenMessage);

  // * secondary functions
  const validate = (): boolean => {
    const newErrors: FormPurchasesOrderErrorDto = {};

    if (!form.providerName) newErrors.providerName = "Ingrese el nombre del cliente";
    if (!form.purchaseTypeId) newErrors.purchaseTypeId = "Seleccione el tipo de gasto";
    if (!form.amount) newErrors.amount = 'Ingrese el monto';
    // if (form.productList.length === 0) newErrors.productList = "Ingrese uno ó más productos a la lista";

    setFormError(newErrors);

    return Object.keys(newErrors).length === 0;
  };
  
  const save = (form: FormPurchasesOrderDto): Promise<PurchasesOrderInterface> => {
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
      code            : form.code ? Number(form.code) : undefined,
      providerName    : form.providerName,
      providerIdDoc   : form.providerIdDoc,
      providerEmail   : form.providerEmail,
      providerPhone   : form.providerPhone,
      providerAddress : form.providerAddress,
      comment         : form.comment,
      amount          : form.amount,
      documentTypeId  : form.documentTypeId,
      documentNumber  : form.documentNumber,
      purchaseTypeId  : form.purchaseTypeId,
      productList     : productList,
      status          : form.status
    };

    return mutateOrder({ variables: { input: obj } })
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
      console.error(`save: ${JSON.stringify(error)}`);
      console.error('save: Error', error);
      throw error;
    });
  };

  const calculateTotals = (formOrderProductList: FormPurchasesOrderProductDto[]) => {
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

  const formatCode = (code: number) => {
    if (!Number.isFinite(code)) 
      throw new Error('formatCode: value must be a finite number');

    let formattedCode = String(code);
    if (code < 100000)
      formattedCode = String(code).padStart(6, '0');

    return formattedCode;
  }

  return (
    <purchasesOrderContext.Provider
      value={{
        formSearch,
        formList,
        setFormSearch,
        search,
        updateTable,
        
        form,
        formError,
        updateForm,
        updateTableOrderProduct,
        saveForm,
        saveFormStatus,
        deleteForm,
        setFormError,
        cleanForm,
        
        isOpenFormSection,
        setIsOpenFormSection,

        screenMessage,
        setScreenMessage,
        resetScreenMessage,

        actionList,
        setActionList,
        
        formatCode
      }}
    >
      {children}
    </purchasesOrderContext.Provider>
  );
};
