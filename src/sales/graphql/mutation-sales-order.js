import { gql } from "@apollo/client";

export const UPDATE_ORDER = gql`
  mutation CreateOrder($input: SalesOrderInput!) {
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