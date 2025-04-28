import { ProductsElementUnitEnum } from "../../element/enums/products-element-unit.enum";

export interface ProductsProductInterface {
  companyId?:   string;
  id?:          string;
  name:         string;
  code?:        string;
  description?: string;
  cost?:        number;
  price?:       number;
  imagenUrl?:   string;
  hasFormula:   boolean;
  productTypeId?: string;
  elementList: ProductsProductElementInterface[];
}

export interface ProductsProductElementInterface {
  id:   string;
  qty:  number;
  name?: string;
  cost?: number;
  unit?: ProductsElementUnitEnum;
}