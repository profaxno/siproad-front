import { gql } from "@apollo/client";

export const GET_ORDERS = gql`
  query FindOrders($searchList: [String!]) {
    salesOrderFind(searchList: $searchList) {
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