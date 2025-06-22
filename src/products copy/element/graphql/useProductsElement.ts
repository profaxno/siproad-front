import { gql, useLazyQuery } from "@apollo/client";

import { ResponseInterface } from "../../../common/graphql/response";

import { ProductsElementInterface } from "../interfaces/products-element.interface";

// * hooks
export const useSearchElement = () => {

  const [fetchElements, { data, loading, error }] = useLazyQuery<ResponseProductsElementSearchByValues>(SEARCH_ELEMENTS, {
    fetchPolicy: "no-cache",
  });

  const productsElementSearchByValues = data?.productsElementSearchByValues;

  return {
    fetchElements,
    productsElementSearchByValues,
    loading,
    errorProductsOrderSearchByValues: error,
  };
  
};

// * GraphQL Queries
const SEARCH_ELEMENTS = gql`
  query ProductsElementSearchByValues($name: String, $elementTypeId: String) {
    productsElementSearchByValues(name: $name, elementTypeId: $elementTypeId) {
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

// * interfaces
interface ResponseProductsElementSearchByValues {
  productsElementSearchByValues: ResponseInterface<ProductsElementInterface[]>;
}