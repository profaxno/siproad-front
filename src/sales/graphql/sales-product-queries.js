import { gql } from "@apollo/client";

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

// export const GET_PRODUCTS = gql`
//   query FindProducts($searchList: [String!]) {
//     salesProductFind(searchList: $searchList) {
//       internalCode
//       message
//       qty
//       payload {
//         id
//         name
//         code
//         cost
//         price
//       }
//     }
//   }
// `;