import { gql, useLazyQuery } from "@apollo/client";
import { PurchasesProductInterface } from "../interfaces";
import { ResponseInterface } from "../../../common/graphql/response";

// * hooks
export const useSearchProduct = () => {

  const [fetchProducts, { data, loading, error }] = useLazyQuery<ResponsePurchasesProductSearchByValues>(SEARCH_PRODUCTS, {
    fetchPolicy: "no-cache",
  });

  const purchasesProductSearchByValues = data?.purchasesProductSearchByValues;

  return {
    fetchProducts,
    purchasesProductSearchByValues,
    loading,
    errorPurchasesOrderSearchByValues: error,
  };
  
};

// * GraphQL Queries
export const SEARCH_PRODUCTS = gql`
  query PurchasesProductSearchByValues($nameCodeList: [String!], $productTypeList: [Float!], $productCategoryId: String, $page: Float, $limit: Float) {
    purchasesProductSearchByValues(nameCodeList: $nameCodeList, productTypeList: $productTypeList, productCategoryId: $productCategoryId, page: $page, limit: $limit) {
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
        type
        enable4Sale
      }
    }
  }
`;

// * interfaces
export interface ResponsePurchasesProductSearchByValues {
  purchasesProductSearchByValues: ResponseInterface<PurchasesProductInterface[]>;
}