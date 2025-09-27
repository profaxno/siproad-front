export class FormPurchasesOrderDto {
  id?: string;
  code?: string;
  providerIdDoc?: string;
  providerName: string;
  providerEmail?: string;
  providerPhone?: string;
  providerAddress?: string;
  comment?: string;
  amount: number;
  documentTypeId?: string;
  documentNumber?: string;
  purchaseTypeId?: string;
  createdAt?: string;
  status: number;
  productList: FormPurchasesOrderProductDto[];
  total?: number;

  constructor(
    providerName: string,
    amount: number,
    status: number,
    productList: FormPurchasesOrderProductDto[],
    id?: string,
    code?: string,
    providerIdDoc?: string,
    providerEmail?: string,
    providerPhone?: string,
    providerAddress?: string,
    comment?: string,
    documentTypeId?: string,
    documentNumber?: string,
    purchaseTypeId?: string,
    createdAt?: string,
    total?: number,
  ) {
    this.providerName = providerName;
    this.amount = amount;
    this.status = status;
    this.productList = productList;
    this.id = id;
    this.code = code;
    this.purchaseTypeId = purchaseTypeId;
    this.documentTypeId = documentTypeId;
    this.providerIdDoc = providerIdDoc;
    this.providerEmail = providerEmail;
    this.providerPhone = providerPhone;
    this.providerAddress = providerAddress;
    this.comment = comment;
    this.documentNumber = documentNumber;
    this.createdAt = createdAt;
    this.total = total;
  }
}


export class FormPurchasesOrderProductDto {
  key: string;
  id: string;
  qty: number;
  comment?: string;
  name: string;
  code?: string;
  cost: number;
  newCost?: number;
  amount: number;
  updateProductCost: boolean;
  status: number;

  constructor(
    key: string,
    id: string,
    qty: number,
    name: string,
    cost: number,
    newCost: number,
    amount: number,
    updateProductCost: boolean,
    status: number,
    comment?: string,
    code?: string,
  ) {
    this.key = key;
    this.id = id;
    this.qty = qty;
    this.name = name;
    this.cost = cost;
    this.newCost = newCost;
    this.amount = amount;
    this.updateProductCost = updateProductCost;
    this.status = status;
    this.comment = comment;
    this.code = code;
  }
}


export class FormPurchasesOrderErrorDto {
  providerName?: string;
  amount?: string;
  purchaseTypeId?: string;
  documentTypeId?: string;
  productList?: string;

  constructor(
    providerName?: string,
    amount?: string,
    purchaseTypeId?: string,
    documentTypeId?: string,
    productList?: string,
  ) {
    this.providerName = providerName;
    this.amount = amount;
    this.purchaseTypeId = purchaseTypeId;
    this.documentTypeId = documentTypeId;
    this.productList = productList;
  }
}



// export interface FormPurchasesOrderInterface {
//   id?: string;
//   code?: number;
//   purchaseTypeId?: string;
//   documentTypeId?: string;
//   providerIdDoc?: string;
//   providerName: string;
//   providerEmail?: string;
//   providerPhone?: string;
//   providerAddress?: string;
//   comment?: string;
//   amount: number;
//   documentNumber?: string;
//   createdAt?: string;
//   status: number;
//   productList: FormPurchasesOrderProductInterface[];
//   total?: number;
// }

// export interface FormPurchasesOrderProductInterface {
//   key: string;
//   id: string;
//   qty: number;
//   comment?: string;
//   name: string;
//   code?: string;
//   cost: number;
//   amount: number;
//   updateProductCost: boolean;
//   status: number;
// }

// export interface FormPurchasesOrderErrorInterface {
//   providerName?: string;
//   amount?      : number;
//   purchaseTypeId?: string;
//   documentTypeId?: string;
//   productList?: string;
// }