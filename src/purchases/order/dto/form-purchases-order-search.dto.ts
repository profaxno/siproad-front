export class FormPurchasesOrderSearchDto {
  code: string;
  providerNameIdDoc: string;
  comment: string;
  createdAtInit: string;
  createdAtEnd: string;

  constructor(code: string, providerNameIdDoc: string, comment: string, createdAtInit: string, createdAtEnd: string) {
    this.code = code;
    this.providerNameIdDoc = providerNameIdDoc;
    this.comment = comment;
    this.createdAtInit = createdAtInit;
    this.createdAtEnd = createdAtEnd;
  }

}

// export interface FormPurchasesOrderSearchInterface {
//   code: string;
//   providerNameIdDoc: string;
//   comment: string;
//   createdAtInit: string;
//   createdAtEnd: string;
// }
