import { gql } from "@apollo/client";

export const UPDATE_ORDER = gql`
  mutation CreateOrder($input: SalesOrderInput!) {
    salesOrderUpdate(order: $input) {
      internalCode
      message
      qty
      payload {
        id
        comment
        cost
        price
        productList {
          name
          cost
          price
          qty
          comment
        }
      }
    }
  }
`;	