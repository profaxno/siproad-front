import { gql } from "@apollo/client";

export const GET_ELEMENTS = gql`
  query ProductsElementFind($searchList: [String!]) {
    productsElementFind(searchList: $searchList) {
      internalCode
      message
      qty
      payload {
        id
        companyId
        name
        cost
        stock
        unit
      }
    }
  }
`;