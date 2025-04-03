import { gql } from "@apollo/client";

// TODO: ajustar a customer
export const GET_PRODUCTS = gql`
  query FindProducts($searchList: [String!]) {
    salesProductFind(searchList: $searchList) {
      internalCode
      message
      qty
      payload {
        id
        name
        cost
        price
      }
    }
  }
`;
