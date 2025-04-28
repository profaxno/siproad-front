export interface SalesOrderInterface {
  companyId?:      string;
  id?:             string;
  code?:           string;
  customerIdDoc?:  string;
  customerName:    string;
  customerEmail?:  string;
  customerPhone?:  string;
  customerAddress?:string;
  comment?:        string;
  productList:     SalesOrderProductInterface[];
  price:           number;
  cost:            number;
  discount?:       number;
  discountPct:     number;
  createdAt?:      string;
  status:          number;
}

export interface SalesOrderProductInterface {
  id:          string;
  qty:         number;
  comment?:    string;
  name:        string;
  code?:       string;
  cost:        number;
  price:       number;
  discount:    number;
  discountPct: number;
  status:      number;
}