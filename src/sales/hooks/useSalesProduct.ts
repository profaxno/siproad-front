import { useLazyQuery } from "@apollo/client";

import { SEARCH_PRODUCTS } from "../graphql/sales-product-search-by-values.graphql";
import { ResponseSalesProductSearchByValues } from "../graphql/sales-product-search-by-values.graphql";

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