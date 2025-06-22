import { ActiveStatusEnum } from "../../../common/enums";
import { ProductTypeEnum } from "../enums/product-type.enum";

export interface FormProductsProductInterface {
  companyId?: string;
  id?: string;
  productCategoryId?: string;
  name: string;
  code?: string;
  description?: string;
  unit?: string;
  cost?: number;
  price?: number;
  type: ProductTypeEnum;
  enable4Sale: boolean;
  elementList?: FormProductsProductElementInterface[];
  status?: ActiveStatusEnum;
}

export interface FormProductsProductElementInterface {
  key: string;
  element: FormProductsProductInterface;
  // id: string;
  qty: number;
  // name: string;
  // cost: number;
  // unit: string;
  status: number;
}

export interface FormProductsProductErrorInterface {
  name?: string;
  cost?: number;
  price?: number;
}