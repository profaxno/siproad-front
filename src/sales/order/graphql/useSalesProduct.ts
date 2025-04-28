import { gql, useLazyQuery } from "@apollo/client";
import { SalesProductInterface } from "../interfaces";
import { ResponseInterface } from "../../../common/graphql/response";

// * hooks
export const useSearchProduct = () => {

  const [fetchProducts, { data, loading, error }] = useLazyQuery<ResponseSalesProductSearchByValues>(SEARCH_PRODUCTS, {
    fetchPolicy: "no-cache",
  });

  const salesProductSearchByValues = data?.salesProductSearchByValues;

  return {
    fetchProducts,
    salesProductSearchByValues,
    loading,
    errorSalesOrderSearchByValues: error,
  };
  
};

// * GraphQL Queries
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

// * interfaces
export interface ResponseSalesProductSearchByValues {
  salesProductSearchByValues: ResponseInterface<SalesProductInterface[]>;
}