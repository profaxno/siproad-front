import { ActiveStatusEnum } from "../../../common/enums";
import { ProductTypeEnum } from "../enums/product-type.enum";

export interface FormInventoryProductInterface {
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
  elementList?: FormInventoryProductElementInterface[];
  status?: ActiveStatusEnum;
  readonly?: boolean;
}

export interface FormInventoryProductElementInterface {
  key: string;
  element: FormInventoryProductInterface;
  // id: string;
  qty: number;
  // name: string;
  // cost: number;
  // unit: string;
  status: number;
}

export interface FormInventoryProductErrorInterface {
  name?: string;
  cost?: number;
  price?: number;
}