export class FormPurchasesPurchaseTypeDto {
  id?: string;
  name: string;
  
  constructor(name: string, id?: string) {
    this.id = id;
    this.name = name;
  }
}

export class FormPurchasesPurchaseTypeErrorDto {
  name?: string;
  
  constructor(name?: string) {
    this.name = name;
  }
}