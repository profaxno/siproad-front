import { createContext } from 'react';

import { ScreenMessageInterface } from '../../../common/interfaces';
import { TableActionEnum, ActionEnum } from '../../../common/enums';

import { FormProductsProductSearchDto, FormProductsProductDto, FormProductsProductElementDto, FormProductsProductErrorDto } from '../dto';
import { ProductsProductInterface, ProductsProductUnitInterface } from '../interfaces';
import { ProductTypeEnum } from "../enums";

// * context
interface ProductsProductContextType {
  formSearch    : FormProductsProductSearchDto;
  formList      : FormProductsProductDto[];
  setFormSearch : (formSearch: FormProductsProductSearchDto) => void;
  searchProducts: (withMovements: boolean, nameCode?: string, typeList?: ProductTypeEnum[], productCategoryId?: string, enable4Sale?: boolean) => Promise<ProductsProductInterface[]>;
  updateTable   : (actionType: TableActionEnum, payload?: FormProductsProductDto | FormProductsProductDto[]) => void;

  actionList    : ActionEnum[];
  setActionList : (actionList: ActionEnum[]) => void;

  isOpenSearchSection : boolean;
  isOpenFormSection   : boolean;
  setIsOpenSearchSection: (isOpenSearchSection: boolean) => void; 
  setIsOpenFormSection: (isOpenFormSection: boolean) => void; 

  form          : FormProductsProductDto;
  // formProductElementList : FormProductsProductElementDto;
  formError     : FormProductsProductErrorDto;
  updateForm    : (form: FormProductsProductDto) => void;
  updateTableProductElement: (actionType: TableActionEnum, payload?: FormProductsProductElementDto | FormProductsProductElementDto[]) => void;
  
  saveForm      : () => void;
  deleteForm    : () => void;
  setFormError  : (formError: FormProductsProductErrorDto) => void;
  cleanForm     : () => void;
  mapObjToForm  : (obj: ProductsProductInterface, level: number) => FormProductsProductDto;
  mapFormToObj  : (form: FormProductsProductDto, level: number) => ProductsProductInterface;

  screenMessage     : ScreenMessageInterface;
  setScreenMessage  : (msg: ScreenMessageInterface) => void;
  resetScreenMessage: () => void;
  calculateProfitMargin: (form: FormProductsProductDto) => number;

  searchProductUnits: () => Promise<ProductsProductUnitInterface[]>;
}

export const productsProductContext = createContext<ProductsProductContextType | undefined>(undefined);