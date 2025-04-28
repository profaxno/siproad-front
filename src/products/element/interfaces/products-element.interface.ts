export interface ProductsElementInterface {
  companyId?  : string;
  id          : string;
  name        : string;
  description?: string;
  cost        : number;
  stock?      : number;
  unit        : string;
  elementTypeId?: string;
}