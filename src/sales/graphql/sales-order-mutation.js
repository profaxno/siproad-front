import { gql } from "@apollo/client";

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

// export const DELETE_ORDER = gql`
//   mutation Delete($id: String!) {
//     salesOrderDelete(id: $id) {
//       internalCode
//       message
//     }
//   }
// `;
