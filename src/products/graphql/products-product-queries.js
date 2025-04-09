import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query Find($searchList: [String!]) {
    productsProductFind(searchList: $searchList) {
      internalCode
      message
      qty
      payload {
        id
        companyId
        name
        code
        description
        cost
        price
        hasFormula
        active
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