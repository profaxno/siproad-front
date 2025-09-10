export class FormProductsProductSearchDto {
  nameCode: string;
  productCategoryId: string;
  enable4Sale: boolean;

  constructor(nameCode: string, productCategoryId: string, enable4Sale: boolean) {
    this.nameCode = nameCode;
    this.productCategoryId = productCategoryId;
    this.enable4Sale = enable4Sale;
  }
}
