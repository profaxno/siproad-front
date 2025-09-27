export interface PurchasesOrderInterface {
  companyId?:      string;
  id?:             string;
  code?:           number;
  purchaseTypeId?: string;
  documentTypeId?: string;
  providerIdDoc?:  string;
  providerName:    string;
  providerEmail?:  string;
  providerPhone?:  string;
  providerAddress?:string;
  comment?:        string;
  amount:         number;
  documentNumber?: string;
  createdAt?:      string;
  status:          number;
  productList:     PurchasesOrderProductInterface[];
}

export interface PurchasesOrderProductInterface {
  id:          string;
  qty:         number;
  comment?:    string;
  name:        string;
  code?:       string;
  cost:        number;
  amount:      number;
  updateProductCost: boolean;
  status:      number;
}