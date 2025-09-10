export class SalesProductDto {
  id?: string;
  companyId?: string;
  name: string;
  code?: string;
  description?: string;
  cost?: number;
  price?: number;

  constructor(name: string, code?: string, description?: string, cost?: number, price?: number, id?: string, companyId?: string){
    this.id = id
    this.companyId = companyId;
    this.name = name;
    this.cost = cost;
    this.price = price;
    this.code = code;
    this.description = description;
  }

}