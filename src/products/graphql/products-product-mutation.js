import { gql } from "@apollo/client";

export const UPDATE_PRODUCT = gql`
  mutation Update($product: ProductsProductInput!) {
    productsProductUpdate(product: $product) {
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

export const DELETE_PRODUCT = gql`
  mutation Delete($id: String!) {
  productsProductDelete(id: $id) {
    internalCode
    message
  }
}
`;
