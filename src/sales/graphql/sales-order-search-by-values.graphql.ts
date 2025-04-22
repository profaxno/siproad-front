import { gql } from "@apollo/client";

import { SalesOrderInterface } from "../interfaces/sales-order.interface";

export const SEARCH_ORDERS = gql`
  query SalesOrderSearchByValues($createdAtInit: String, $createdAtEnd: String, $code: String, $customerNameIdDoc: String, $comment: String) {
    salesOrderSearchByValues(createdAtInit: $createdAtInit, createdAtEnd: $createdAtEnd, code: $code, customerNameIdDoc: $customerNameIdDoc, comment: $comment) {
      internalCode
      message
      qty
      payload {
        id
        code
        companyId
        customerIdDoc
        customerName
        customerEmail
        customerPhone
        customerAddress
        comment
        price
        cost
        discount
        discountPct
        createdAt
        status
        productList {
          id
          qty
          comment
          name
          code
          cost
          price
          discount
          discountPct
          status
        }
      }
    }
  }
`;

export interface ResponseSalesOrderSearchByValues {
  salesOrderSearchByValues: SalesOrderSearchByValues;
}

export interface SalesOrderSearchByValues {
  internalCode: number;
  message:      string;
  qty:          number;
  payload:      SalesOrderInterface[];
}