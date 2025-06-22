export interface FormPurchasesOrderInterface {
  id?: string;
  code?: number;
  purchaseTypeId?: string;
  documentTypeId?: string;
  providerIdDoc?: string;
  providerName: string;
  providerEmail?: string;
  providerPhone?: string;
  providerAddress?: string;
  comment?: string;
  amount: number;
  documentNumber?: string;
  createdAt?: string;
  status: number;
  productList: FormPurchasesOrderProductInterface[];
  total?: number;
}

export interface FormPurchasesOrderProductInterface {
  key: string;
  id: string;
  qty: number;
  comment?: string;
  name: string;
  code?: string;
  cost: number;
  amount: number;
  updateProductCost: boolean;
  status: number;
}

export interface FormPurchasesOrderErrorInterface {
  providerName?: string;
  amount?      : number;
  purchaseTypeId?: string;
  documentTypeId?: string;
  productList?: string;
}
