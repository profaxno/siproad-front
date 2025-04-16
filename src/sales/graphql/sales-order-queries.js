import { gql } from "@apollo/client";

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

// export const GET_ORDERS = gql`
//   query FindOrders($searchList: [String!]) {
//     salesOrderFind(searchList: $searchList) {
//       internalCode
//       message
//       qty
//       payload {
//         id
//         code
//         customerIdDoc
//         customerName
//         customerEmail
//         customerPhone
//         customerAddress
//         comment
//         cost
//         price
//         createdAt
//         status
//         productList {
//           id
//           name
//           code
//           cost
//           price
//           qty
//           comment
//           discount
//           discountPct
//           status
//         }
//       }
//     }
//   }
// `;