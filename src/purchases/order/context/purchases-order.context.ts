import { createContext } from 'react';

import { ScreenMessageInterface } from '../../../common/interfaces';
import { TableActionEnum } from '../../../common/enums';

import { PurchasesOrderInterface } from "../interfaces";
import { FormPurchasesOrderSearchDto, FormPurchasesOrderDto, FormPurchasesOrderProductDto, FormPurchasesOrderErrorDto } from '../dto';
import { PurchasesOrderStatusEnum, PurchasesActionEnum } from '../enums';

// * context
interface PurchasesOrderContextType {
  formSearch    : FormPurchasesOrderSearchDto;
  formList      : FormPurchasesOrderDto[];
  setFormSearch : (formSearch: FormPurchasesOrderSearchDto) => void;
  search        : (createdAtInit?: string, createdAtEnd?: string, code?: string, providerNameIdDoc?: string, comment?: string) => Promise<PurchasesOrderInterface[]>;
  updateTable   : (actionType: TableActionEnum, payload?: FormPurchasesOrderDto | FormPurchasesOrderDto[]) => void;
  
  form        : FormPurchasesOrderDto;
  formError   : FormPurchasesOrderErrorDto;
  updateForm  : (form: FormPurchasesOrderDto) => void;
  updateTableOrderProduct: (actionType: TableActionEnum, payload?: FormPurchasesOrderProductDto | FormPurchasesOrderProductDto[]) => void;
  
  saveForm      : () => void;
  saveFormStatus: (status: PurchasesOrderStatusEnum) => void;
  deleteForm    : () => void;
  setFormError  : (formError: FormPurchasesOrderErrorDto) => void;
  cleanForm     : () => void;
  
  isOpenFormSection: boolean;
  setIsOpenFormSection: (isOpen: boolean) => void;

  screenMessage     : ScreenMessageInterface;
  setScreenMessage  : (msg: ScreenMessageInterface) => void;
  resetScreenMessage: () => void;

  actionList    : PurchasesActionEnum[];
  setActionList : (actionList: PurchasesActionEnum[]) => void;

  formatCode: (code: number) => string;
}

export const purchasesOrderContext = createContext<PurchasesOrderContextType | undefined>(undefined);