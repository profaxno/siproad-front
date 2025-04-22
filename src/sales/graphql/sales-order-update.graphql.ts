import { gql } from "@apollo/client";

import { SalesOrderInterface } from "../interfaces/sales-order.interface";

export const UPDATE_ORDER = gql`
  mutation Update($input: SalesOrderInput!) {
    salesOrderUpdate(order: $input) {
      internalCode
      message
      qty
      payload {
        id
        code
        customerIdDoc
        customerName
        customerEmail
        customerPhone
        customerAddress
        comment
        cost
        price
        createdAt
        status
        productList {
          id
          name
          code
          cost
          price
          qty
          comment
          discount
          discountPct
          status
        }
      }
    }
  }
`;

export interface ResponseSalesOrderUpdate {
  salesOrderUpdate: SalesOrderUpdate;
}

export interface SalesOrderUpdate {
  internalCode: number;
  message:      string;
  qty:          number;
  payload:      SalesOrderInterface[];
}