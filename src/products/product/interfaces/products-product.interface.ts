import { ProductTypeEnum, ProductUnitEnum } from "../enums";
export interface ProductsProductInterface {
  id?:          string;
  name:         string;
  code?:        string;
  description?: string;
  unit?:        ProductUnitEnum;
  cost:        number;
  price:       number;
  type:         ProductTypeEnum;
  enable4Sale:  boolean;
  stock?:       number;
  companyId?:   string;
  productCategoryId?: string;
  productUnitId?: string;
  elementList: ProductsProductElementInterface[];
  movementList: ProductsMovementInterface[];
}

export interface ProductsProductElementInterface {
  element: ProductsProductInterface;
  qty:  number;
}

export interface ProductsMovementInterface {
  id?: string;
  type: number;
  reason: number;
  qty: number;
  relatedId?: string;
  productId: string;
  userId: string;
}