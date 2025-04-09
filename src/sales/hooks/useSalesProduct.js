import { useLazyQuery } from "@apollo/client";

import { GET_PRODUCTS } from "../graphql/sales-product-queries";

export const useSearchProducts = () => {
  
  const [fetchProducts, { data, loading, error }] = useLazyQuery(GET_PRODUCTS, {
    fetchPolicy: "no-cache",
  });

  const payload = data?.salesProductFind?.payload || [];

  return { fetchProducts, elementList: payload, loading, error };
}