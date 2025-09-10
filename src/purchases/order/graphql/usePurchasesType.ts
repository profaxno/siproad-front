import { gql, useLazyQuery } from "@apollo/client";
import { PurchasesTypeInterface } from "../interfaces";
import { ResponseInterface } from "../../../common/graphql/response";

// * hooks
export const useSearchType = () => {

  const [fetchTypes, { data, loading, error }] = useLazyQuery<ResponsePurchasesTypeSearchByValues>(SEARCH_PURCHASE_TYPES, {
    fetchPolicy: "no-cache",
  });

  const purchasesTypeSearchByValues = data?.purchasesTypeSearchByValues;

  return {
    fetchTypes,
    purchasesTypeSearchByValues,
    loading,
    errorPurchasesOrderSearchByValues: error,
  };
  
};

// * GraphQL Queries
export const SEARCH_PURCHASE_TYPES = gql`
  query PurchasesTypeSearchByValues($name: String, $page: Float, $limit: Float) {
    purchasesTypeSearchByValues(name: $name, page: $page, limit: $limit) {
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
export interface ResponsePurchasesTypeSearchByValues {
  purchasesTypeSearchByValues: ResponseInterface<PurchasesTypeInterface[]>;
}