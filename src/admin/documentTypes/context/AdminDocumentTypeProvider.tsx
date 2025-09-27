import type { FC } from "react";
import { useState, useReducer, ReactNode } from 'react';

import { TableActionInterface, ScreenMessageInterface } from '../../../common/interfaces';
import { TableActionEnum, ScreenMessageTypeEnum, ActiveStatusEnum } from '../../../common/enums';
import { tableReducer } from '../../../common/helpers';

import { adminDocumentTypeContext } from './admin-document-type.context';
import { AdminDocumentTypeInterface } from "../interfaces";
import { FormAdminDocumentTypeSearchDto, FormAdminDocumentTypeDto, FormAdminDocumentTypeErrorDto } from '../dto';
import { useSearch, useUpdate } from '../graphql/useAdminDocumentType';

// * provider
const initFormSearch: FormAdminDocumentTypeSearchDto = {
  name: '',
};

const initForm: FormAdminDocumentTypeDto = {
  id  : undefined,
  name: ''
};

const initFormError: FormAdminDocumentTypeErrorDto = {
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

export const AdminDocumentTypeProvider: FC<Props> = ({ children }) => {
  
  const [formSearch, setFormSearch] = useState<FormAdminDocumentTypeSearchDto>(initFormSearch);
  const [formList, dispatchFormList]= useReducer(tableReducer<FormAdminDocumentTypeDto>, []);
  const { fetch }                   = useSearch();

  const [form, setForm]             = useState<FormAdminDocumentTypeDto>(initForm);
  const [formError, setFormError]   = useState<FormAdminDocumentTypeErrorDto>(initFormError);
  const { mutateUpdate }            = useUpdate();

  const [isOpenFormSection, setIsOpenFormSection] = useState<boolean>(false);
  const [screenMessage, setScreenMessage] = useState<ScreenMessageInterface>(initScreenMessage);


  const search = (name?: string): Promise<AdminDocumentTypeInterface[]> => {

    return fetch({ variables: { name } })
    .then( (response) => {

      const { adminDocumentTypeSearchByValues } = response.data || {};
      const { internalCode = 0, message, payload = [] } = adminDocumentTypeSearchByValues || {};

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

  const updateTable = (actionType: TableActionEnum, payload?: FormAdminDocumentTypeDto | FormAdminDocumentTypeDto[]) => {
    
    const tableAction: TableActionInterface<FormAdminDocumentTypeDto> = {
      type: actionType,
      payload
    }

    dispatchFormList(tableAction);
  };

  const updateForm = (form: FormAdminDocumentTypeDto = initForm) => {
    setForm(form);
  };

  const saveForm = () => {
    if (!validate()) return;

    save(form)
    .then( (mutatedObj: AdminDocumentTypeInterface) => {
      const found = formList.find((value) => value.id === form.id);
      const actionType = found ? TableActionEnum.UPDATE : TableActionEnum.ADD;

      const formMutated: FormAdminDocumentTypeDto = {
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

  const cleanForm = () => {
    setForm(initForm);
    setFormError(initFormError);
  };

  const resetScreenMessage = () => setScreenMessage(initScreenMessage);

  // * secundary functions
  const validate = (): boolean => {
    const newErrors: FormAdminDocumentTypeErrorDto = {};

    if (!form.name) newErrors.name = "Ingrese el nombre del tipo de documento";
    
    setFormError(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const save = (form: FormAdminDocumentTypeDto): Promise<AdminDocumentTypeInterface> => {
    console.log(JSON.stringify(form));

    const obj: AdminDocumentTypeInterface = {
      id  : form.id || undefined,
      name: form.name
    };

    return mutateUpdate({ variables: { input: obj } })
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
      console.error(`saveDocumentType: ${JSON.stringify(error)}`);
      console.error('saveDocumentType: Error', error);
      throw error;
    });
  };

  return (
    <adminDocumentTypeContext.Provider
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
    </adminDocumentTypeContext.Provider>
  );
};
