import { ProductsElementUnitEnum } from "../../element/enums/products-element-unit.enum";
import { ProductTypeEnum } from "../enums/product-type.enum";

export interface InventoryProductInterface {
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
  elementList: InventoryProductElementInterface[];
}

export interface InventoryProductElementInterface {
  element: InventoryProductInterface;
  qty:  number;
}