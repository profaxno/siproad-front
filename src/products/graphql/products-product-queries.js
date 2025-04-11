import { gql } from "@apollo/client";


export const SEARCH_PRODUCTS = gql`
  query ProductProductSearchByValues($nameCode: String, $productTypeId: String) {
    productProductSearchByValues(nameCode: $nameCode, productTypeId: $productTypeId) {
      internalCode
      message
      qty
      payload {
        id
        name
        code
        description
        cost
        price
        hasFormula
        active
        companyId
        elementList {
          id
          qty
          name
          cost
          unit
        }
      }
    }
  }
`;

// export const GET_PRODUCTS = gql`
//   query Find($searchList: [String!]) {
//     productsProductFind(searchList: $searchList) {
//       internalCode
//       message
//       qty
//       payload {
//         id
//         companyId
//         name
//         code
//         description
//         cost
//         price
//         hasFormula
//         active
//         elementList {
//           id
//           qty
//           name
//           cost
//           unit
//         }
//       }
//     }
//   }
// `;