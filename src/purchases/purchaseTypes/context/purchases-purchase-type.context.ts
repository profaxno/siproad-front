import { createContext } from 'react';

import { ScreenMessageInterface } from '../../../common/interfaces';
import { TableActionEnum } from '../../../common/enums';

import { PurchasesPurchaseTypeInterface } from "../interfaces";
import { FormPurchasesPurchaseTypeSearchDto, FormPurchasesPurchaseTypeDto, FormPurchasesPurchaseTypeErrorDto } from '../dto';

// * context
interface PurchasesPurchaseTypeContextType {
  formSearch    : FormPurchasesPurchaseTypeSearchDto;
  formList      : FormPurchasesPurchaseTypeDto[];
  setFormSearch : (formSearch: FormPurchasesPurchaseTypeSearchDto) => void;
  search        : (name?: string) => Promise<PurchasesPurchaseTypeInterface[]>;
  updateTable   : (actionType: TableActionEnum, payload?: FormPurchasesPurchaseTypeDto | FormPurchasesPurchaseTypeDto[]) => void;

  form          : FormPurchasesPurchaseTypeDto;
  formError     : FormPurchasesPurchaseTypeErrorDto;
  updateForm    : (form: FormPurchasesPurchaseTypeDto) => void;
  saveForm      : () => void;
  deleteForm    : () => void;
  setFormError  : (formError: FormPurchasesPurchaseTypeErrorDto) => void;
  cleanForm     : () => void;
  
  isOpenFormSection   : boolean;
  setIsOpenFormSection: (isOpen: boolean) => void; 
  
  screenMessage     : ScreenMessageInterface;
  setScreenMessage  : (msg: ScreenMessageInterface) => void;
  resetScreenMessage: () => void;
}

export const purchasesPurchaseTypeContext = createContext<PurchasesPurchaseTypeContextType | undefined>(undefined);