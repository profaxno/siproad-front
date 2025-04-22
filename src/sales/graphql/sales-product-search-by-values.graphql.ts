import { gql } from "@apollo/client";

import { SalesProductInterface } from "../interfaces/sales-product.interface";

export const SEARCH_PRODUCTS = gql`
  query SalesProductSearchByValues($nameCodeList: [String!], $productTypeId: String) {
    salesProductSearchByValues(nameCodeList: $nameCodeList, productTypeId: $productTypeId) {
      internalCode
      message
      qty
      payload {
        id
        name
        code
        cost
        price
      }
    }
  }
`;

export interface ResponseSalesProductSearchByValues {
  salesProductSearchByValues: SalesProductSearchByValues;
}

export interface SalesProductSearchByValues {
  internalCode: number;
  message:      string;
  qty:          number;
  payload:      SalesProductInterface[];
}
