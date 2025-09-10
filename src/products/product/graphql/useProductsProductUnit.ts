import { gql, useLazyQuery } from "@apollo/client";
import { ResponseInterface } from "../../../common/graphql/response";
import { ProductsProductUnitInterface } from "../interfaces";

// * hooks
export const useSearchProductUnit = () => {

  const [fetchProductUnits, { data, loading, error }] = useLazyQuery<ResponseProductsProductUnitSearchByValues>(SEARCH_PRODUCT_UNITS, {
    fetchPolicy: "no-cache",
  });

  const productsProductUnitSearchByValues = data?.productsProductUnitSearchByValues;

  return {
    fetchProductUnits,
    productsProductUnitSearchByValues,
    loading,
    errorProductsOrderSearchByValues: error,
  };
  
};

// * GraphQL Queries
export const SEARCH_PRODUCT_UNITS = gql`
  query ProductsProductUnitSearchByValues($name: String, $page: Float, $limit: Float) {
    productsProductUnitSearchByValues(name: $name, page: $page, limit: $limit) {
      internalCode
      message
      qty
      payload {
        companyId
        name
        id
      }
    }
  }
`;

// * interfaces
export interface ResponseProductsProductUnitSearchByValues {
  productsProductUnitSearchByValues: ResponseInterface<ProductsProductUnitInterface[]>;
}