import { ActiveStatusEnum } from "../../../common/enums";

export interface FormProductsProductInterface {
  id?: string;
  name: string;
  code?: string;
  description?: string;
  cost?: number;
  price?: number;
  imagenUrl?: string;
  hasFormula: boolean;
  productTypeId?: string;
  elementList: FormProductsProductElementInterface[];
  status: ActiveStatusEnum;
  readonly: boolean;
}

export interface FormProductsProductElementInterface {
  key: string;
  id: string;
  qty: number;
  name: string;
  cost: number;
  unit: string;
  status: number;
}

export interface FormProductsProductErrorInterface {
  name?: string;
  cost?: number;
  price?: number;
}
