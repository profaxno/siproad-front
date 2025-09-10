import { createContext } from 'react';

import { ScreenMessageInterface } from '../../../common/interfaces';
import { TableActionEnum } from '../../../common/enums';

import { SalesOrderInterface } from '../interfaces';
import { FormSalesOrderDto, FormSalesOrderProductDto, FormSalesOrderErrorDto, FormSalesOrderSearchDto } from '../dto';
import { SalesOrderStatusEnum, SalesActionEnum } from '../enums';

// * context
interface SalesOrderContextType {
  formSearch    : FormSalesOrderSearchDto;
  formList      : FormSalesOrderDto[];
  setFormSearch : (formSearch: FormSalesOrderSearchDto) => void;
  searchOrders  : (createdAtInit?: string, createdAtEnd?: string, code?: string, customerNameIdDoc?: string, comment?: string) => Promise<SalesOrderInterface[]>;
  updateTable   : (actionType: TableActionEnum, payload?: FormSalesOrderDto | FormSalesOrderDto[]) => void;

  actionList    : SalesActionEnum[];
  setActionList : (actionList: SalesActionEnum[]) => void;

  isOpenOrderSection: boolean;
  form        : FormSalesOrderDto;
  formError   : FormSalesOrderErrorDto;
  setIsOpenOrderSection: (isOpenOrderSection: boolean) => void; 
  updateForm  : (form: FormSalesOrderDto) => void;
  updateTableOrderProduct: (actionType: TableActionEnum, payload?: FormSalesOrderProductDto | FormSalesOrderProductDto[]) => void;
  //saveOrder   : (form: FormSalesOrderDto) => Promise<SalesOrderInterface>;
  
  // validate    : () => boolean;
  saveForm      : () => void;
  saveFormStatus: (status: SalesOrderStatusEnum) => void;
  deleteForm    : () => void;
  setFormError  : (formError: FormSalesOrderErrorDto) => void;
  cleanForm     : () => void;
  
  screenMessage     : ScreenMessageInterface;
  setScreenMessage  : (msg: ScreenMessageInterface) => void;
  resetScreenMessage: () => void;
  formatCode        : (code: number) => string;
}

export const salesOrderContext = createContext<SalesOrderContextType | undefined>(undefined);