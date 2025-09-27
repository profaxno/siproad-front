import type { FC } from "react";
import { useState, useReducer, ReactNode } from 'react';

import { TableActionInterface, ScreenMessageInterface } from '../../../common/interfaces';
import { TableActionEnum, ScreenMessageTypeEnum, ActiveStatusEnum } from '../../../common/enums';
import { tableReducer } from '../../../common/helpers';


import { PurchasesPurchaseTypeInterface } from "../interfaces";
import { FormPurchasesPurchaseTypeSearchDto, FormPurchasesPurchaseTypeDto, FormPurchasesPurchaseTypeErrorDto } from '../dto';
import { useSearch, useUpdate } from '../graphql/usePurchasesPurchaseType';
import { purchasesPurchaseTypeContext } from './purchases-purchase-type.context';

// * provider
const initFormSearch: FormPurchasesPurchaseTypeSearchDto = {
  name: '',
};

const initForm: FormPurchasesPurchaseTypeDto = {
  id  : undefined,
  name: ''
};

const initFormError: FormPurchasesPurchaseTypeErrorDto = {
  name: ''
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

export const PurchasesPurchaseTypeProvider: FC<Props> = ({ children }) => {
  
  const [formSearch, setFormSearch] = useState<FormPurchasesPurchaseTypeSearchDto>(initFormSearch);
  const [formList, dispatchFormList]= useReducer(tableReducer<FormPurchasesPurchaseTypeDto>, []);
  const { fetch }                   = useSearch();

  const [form, setForm]             = useState<FormPurchasesPurchaseTypeDto>(initForm);
  const [formError, setFormError]   = useState<FormPurchasesPurchaseTypeErrorDto>(initFormError);
  const { mutateUpdate }            = useUpdate();

  const [isOpenFormSection, setIsOpenFormSection] = useState<boolean>(false);
  const [screenMessage, setScreenMessage] = useState<ScreenMessageInterface>(initScreenMessage);


  const search = (name?: string): Promise<PurchasesPurchaseTypeInterface[]> => {

    return fetch({ variables: { name } })
    .then( (response) => {

      const { purchasesPurchaseTypeSearchByValues } = response.data || {};
      const { internalCode = 0, message, payload = [] } = purchasesPurchaseTypeSearchByValues || {};

      if (![200, 400, 404].includes(internalCode)) {
        throw new Error(message);
      }

      return payload;
    })
    .catch((error: any) => {
      console.error('Error searchDocumentTypes:', error);
      throw error;
    });

  };

  const updateTable = (actionType: TableActionEnum, payload?: FormPurchasesPurchaseTypeDto | FormPurchasesPurchaseTypeDto[]) => {
    
    const tableAction: TableActionInterface<FormPurchasesPurchaseTypeDto> = {
      type: actionType,
      payload
    }

    dispatchFormList(tableAction);
  };

  const updateForm = (form: FormPurchasesPurchaseTypeDto = initForm) => {
    setForm(form);
  };

  const validate = (): boolean => {
    const newErrors: FormPurchasesPurchaseTypeErrorDto = {};

    if (!form.name) newErrors.name = "Ingrese el nombre del tipo de gasto";
    
    setFormError(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const saveForm = () => {
    if (!validate()) return;

    save(form)
    .then( (mutatedObj: PurchasesPurchaseTypeInterface) => {
      const found = formList.find((value) => value.id === form.id);
      const actionType = found ? TableActionEnum.UPDATE : TableActionEnum.ADD;

      const formMutated: FormPurchasesPurchaseTypeDto = {
        ...form,
        id: mutatedObj.id
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
      status: ActiveStatusEnum.DELETED,
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

  const save = (form: FormPurchasesPurchaseTypeDto): Promise<PurchasesPurchaseTypeInterface> => {
    console.log(JSON.stringify(form));

    const obj: PurchasesPurchaseTypeInterface = {
      id  : form.id || undefined,
      name: form.name
    };

    return mutateUpdate({ variables: { order: obj } })
    .then( (response) => {
      
      const { adminDocumentTypeUpdate } = response.data || {};
      const { internalCode = 0, message, payload = [] } = adminDocumentTypeUpdate || {};

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

  const cleanForm = () => {
    setForm(initForm);
    setFormError(initFormError);
  };

  const resetScreenMessage = () => setScreenMessage(initScreenMessage);

  return (
    <purchasesPurchaseTypeContext.Provider
      value={{
        formSearch,
        formList,
        setFormSearch,
        search,
        updateTable,

        form,
        formError,
        updateForm,
        saveForm,
        deleteForm,
        setFormError,
        cleanForm,
        
        isOpenFormSection,
        setIsOpenFormSection,

        screenMessage,
        setScreenMessage,
        resetScreenMessage
      }}
    >
      {children}
    </purchasesPurchaseTypeContext.Provider>
  );
};
