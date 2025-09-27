import { createContext } from 'react';

import { ScreenMessageInterface } from '../../../common/interfaces';
import { TableActionEnum } from '../../../common/enums';

import { AdminDocumentTypeInterface } from "../interfaces";
import { FormAdminDocumentTypeSearchDto, FormAdminDocumentTypeDto, FormAdminDocumentTypeErrorDto } from '../dto';

// * context
interface AdminDocumentTypeContextType {
  formSearch    : FormAdminDocumentTypeSearchDto;
  formList      : FormAdminDocumentTypeDto[];
  setFormSearch : (formSearch: FormAdminDocumentTypeSearchDto) => void;
  search        : (name?: string) => Promise<AdminDocumentTypeInterface[]>;
  updateTable   : (actionType: TableActionEnum, payload?: FormAdminDocumentTypeDto | FormAdminDocumentTypeDto[]) => void;

  form          : FormAdminDocumentTypeDto;
  formError     : FormAdminDocumentTypeErrorDto;
  updateForm    : (form: FormAdminDocumentTypeDto) => void;
  saveForm      : () => void;
  deleteForm    : () => void;
  setFormError  : (formError: FormAdminDocumentTypeErrorDto) => void;
  cleanForm     : () => void;
  
  isOpenFormSection: boolean;
  setIsOpenFormSection: (isOpen: boolean) => void; 
  
  screenMessage     : ScreenMessageInterface;
  setScreenMessage  : (msg: ScreenMessageInterface) => void;
  resetScreenMessage: () => void;
}

export const adminDocumentTypeContext = createContext<AdminDocumentTypeContextType | undefined>(undefined);