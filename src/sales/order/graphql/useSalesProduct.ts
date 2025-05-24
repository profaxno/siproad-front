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
  query SalesProductSearchByValues($nameCodeList: [String!], $enable4Sale: Boolean, $productCategoryId: String, $page: Float, $limit: Float) {
    salesProductSearchByValues(nameCodeList: $nameCodeList, enable4Sale: $enable4Sale, productCategoryId: $productCategoryId, page: $page, limit: $limit) {
      internalCode
      message
      payload {
        id
        companyId
        name
        code
        description
        cost
        price
        type
        enable4Sale
      }
      qty
    }
  }
`;

// * interfaces
export interface ResponseSalesProductSearchByValues {
  salesProductSearchByValues: ResponseInterface<SalesProductInterface[]>;
}