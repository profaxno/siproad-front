export interface FormSalesOrderInterface {
  id?: string;
  code?: string;
  customerIdDoc?: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
  comment?: string;
  productList: FormSalesOrderProductInterface[];
  subTotal?: number;
  iva?: number;
  total?: number;
  createdAt?: string;
  status: number;
}

export interface FormSalesOrderProductInterface {
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
}

export interface FormSalesOrderErrorInterface {
  customerName?: string;
  productList?: string;
}
