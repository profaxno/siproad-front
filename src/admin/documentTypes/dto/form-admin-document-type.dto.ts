export class FormAdminDocumentTypeDto {
  id?: string;
  name: string;
  
  constructor(name: string, id?: string) {
    this.id = id;
    this.name = name;
  }
}

export class FormAdminDocumentTypeErrorDto {
  name?: string;
  
  constructor(name?: string) {
    this.name = name;
  }
}