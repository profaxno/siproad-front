import { ActiveStatusEnum } from "../../../common/enums";
import { ProductUnitEnum } from "../enums";
import { ProductTypeEnum } from "../enums/product-type.enum";

export class FormProductsProductDto {
  id?: string;
  name: string;
  code?: string;
  description?: string;
  unit?: ProductUnitEnum;
  cost?: number;
  price?: number;
  type: ProductTypeEnum;
  enable4Sale: boolean;
  status?: ActiveStatusEnum;
  companyId?: string;
  productCategoryId?: string;
  productUnitId?: string;
  elementList?: FormProductsProductElementDto[];
  movementList?: FormProductsMovementDto[];

  constructor(name: string, type: ProductTypeEnum, enable4Sale: boolean, code?: string, description?: string, unit?: ProductUnitEnum, cost?: number, price?: number, status?: ActiveStatusEnum, id?: string, companyId?: string, productCategoryId?: string, productUnitId?: string, elementList?: FormProductsProductElementDto[], movementList?: FormProductsMovementDto[]) {
    this.id = id;
    this.name = name;
    this.code = code;
    this.description = description;
    this.unit = unit;
    this.cost = cost;
    this.price = price;
    this.type = type;
    this.enable4Sale = enable4Sale;
    this.status = status;
    this.companyId = companyId;
    this.productCategoryId = productCategoryId;
    this.productUnitId = productUnitId;
    this.elementList = elementList;
    this.movementList = movementList;
  }
}

export class FormProductsProductElementDto {
  key: string;
  element: FormProductsProductDto;
  qty: number;
  status: number;

  constructor(key: string, qty: number, element: FormProductsProductDto, status: number) {
    this.key = key;
    this.qty = qty;
    this.element = element;
    this.status = status;
  }
}

export class FormProductsMovementDto {
  id?: string;
  type: number;
  reason: number;
  qty: number;
  relatedId?: string;
  productId: string;
  userId: string;

  constructor(type: number, reason: number, qty: number, productId: string, userId: string, id?: string, relatedId?: string) {
    this.id = id;
    this.type = type;
    this.reason = reason;
    this.qty = qty;
    this.relatedId = relatedId;
    this.productId = productId;
    this.userId = userId;
  }
}

export class FormProductsProductErrorDto {
  name?: string;
  cost?: number;
  price?: number;

  constructor(name?: string, cost?: number, price?: number) {
    this.name = name;
    this.cost = cost;
    this.price = price;
  }
}

// export interface FormProductsProductInterface {
//   id?: string;
//   name: string;
//   code?: string;
//   description?: string;
//   unit?: ProductUnitEnum;
//   cost?: number;
//   price?: number;
//   type: ProductTypeEnum;
//   enable4Sale: boolean;
//   status?: ActiveStatusEnum;
//   companyId?: string;
//   productCategoryId?: string;
//   productUnitId?: string;
//   elementList?: FormProductsProductElementInterface[];
//   movementList?: FormProductsMovementInterface[];
// }

// export interface FormProductsProductElementInterface {
//   key: string;
//   element: FormProductsProductInterface;
//   // id: string;
//   qty: number;
//   // name: string;
//   // cost: number;
//   // unit: string;
//   status: number;
// }

// export interface FormProductsMovementInterface {
//   id?: string;
//   type: number;
//   reason: number;
//   qty: number;
//   relatedId?: string;
//   productId: string;
//   userId: string;
// }

// export interface FormProductsProductErrorInterface {
//   name?: string;
//   cost?: number;
//   price?: number;
// }