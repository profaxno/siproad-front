export class FormSalesOrderSearchDto {
  code: string;
  customerNameIdDoc: string;
  comment: string;
  createdAtInit: string;
  createdAtEnd: string;

  constructor(code: string, customerNameIdDoc: string, comment: string, createdAtInit: string, createdAtEnd: string) {
    this.code = code;
    this.customerNameIdDoc = customerNameIdDoc;
    this.comment = comment;
    this.createdAtInit = createdAtInit;
    this.createdAtEnd = createdAtEnd;
  }

}

// export interface FormSalesOrderSearchInterface {
//   code: string;
//   customerNameIdDoc: string;
//   comment: string;
//   createdAtInit: string;
//   createdAtEnd: string;
// }
