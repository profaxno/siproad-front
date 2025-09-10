export class FormSalesOrderDto {
  id?: string;
  code?: string;
  customerIdDoc?: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
  comment?: string;
  productList: FormSalesOrderProductDto[];
  subTotal?: number;
  iva?: number;
  total?: number;
  createdAt?: string;
  status: number;

  constructor(customerName: string, status: number, productList: FormSalesOrderProductDto[], code?: string, customerIdDoc?: string, customerEmail?: string, customerPhone?: string, customerAddress?: string, comment?: string, subTotal?: number, iva?: number, total?: number, createdAt?: string, id?: string) {
    this.id = id;
    this.code = code;
    this.customerIdDoc = customerIdDoc;
    this.customerName = customerName;
    this.customerEmail = customerEmail;
    this.customerPhone = customerPhone;
    this.customerAddress = customerAddress;
    this.comment = comment;
    this.productList = productList;
    this.subTotal = subTotal;
    this.iva = iva;
    this.total = total;
    this.createdAt = createdAt;
    this.status = status;
  }

}

export class FormSalesOrderProductDto {
  key: string;
  id: string;
  qty: number;
  comment?: string;
  name: string;
  code?: string;
  cost: number;
  price: number;
  discountPct: number;
  subTotal: number;
  status: number;

  constructor(key: string, id: string, qty: number, name: string, cost: number, price: number, discountPct: number, subTotal: number, status: number, comment?: string, code?: string) {
    this.key = key;
    this.id = id;
    this.qty = qty;
    this.comment = comment;
    this.name = name;
    this.code = code;
    this.cost = cost;
    this.price = price;
    this.discountPct = discountPct;
    this.subTotal = subTotal;
    this.status = status;
  }
}

export class FormSalesOrderErrorDto {
  customerName?: string;
  productList?: string;

  constructor(customerName?: string, productList?: string) {
    this.customerName = customerName;
    this.productList = productList;
  }
}

// export interface FormSalesOrderInterface {
//   id?: string;
//   code?: number;
//   customerIdDoc?: string;
//   customerName: string;
//   customerEmail?: string;
//   customerPhone?: string;
//   customerAddress?: string;
//   comment?: string;
//   productList: FormSalesOrderProductInterface[];
//   subTotal?: number;
//   iva?: number;
//   total?: number;
//   createdAt?: string;
//   status: number;
// }

// export interface FormSalesOrderProductInterface {
//   key: string;
//   id: string;
//   qty: number;
//   comment?: string;
//   name: string;
//   code?: string;
//   cost: number;
//   price: number;
//   discountPct: number;
//   subTotal: number;
//   status: number;
// }

// export interface FormSalesOrderErrorInterface {
//   customerName?: string;
//   productList?: string;
// }
