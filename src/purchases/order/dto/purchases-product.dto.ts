export class PurchasesProductDto {
  id: string;
  companyId: string;
  name: string;
  code: string;
  description: string;
  cost: number;
  price: number;

  constructor(
    id: string,
    companyId: string,
    name: string,
    code: string,
    description: string,
    cost: number,
    price: number,
  ) {
    this.id = id;
    this.companyId = companyId;
    this.name = name;
    this.code = code;
    this.description = description;
    this.cost = cost;
    this.price = price;
  }
}
