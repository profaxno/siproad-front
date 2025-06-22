import { ProductsElementUnitEnum } from "../../element/enums/products-element-unit.enum";
import { ProductTypeEnum } from "../enums/product-type.enum";

export interface ProductsProductInterface {
  companyId?:   string;
  id?:          string;
  productCategoryId?: string;
  name:         string;
  code?:        string;
  description?: string;
  unit?:        ProductsElementUnitEnum;
  cost?:        number;
  price?:       number;
  type:        ProductTypeEnum;
  enable4Sale:  boolean;
  elementList: ProductsProductElementInterface[];
}

export interface ProductsProductElementInterface {
  element: ProductsProductInterface;
  qty:  number;
}