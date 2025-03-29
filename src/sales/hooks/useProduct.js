import { useLazyQuery } from "@apollo/client";
import { GET_PRODUCTS } from "../graphql/query-sales-product";

export const useProduct = () => {
  const [fetchProducts, { data, loading, error }] = useLazyQuery(GET_PRODUCTS);

  const internalCode  = data?.salesProductFind?.internalCode || '';
  const message       = data?.salesProductFind?.message || '';
  const qty           = data?.salesProductFind?.qty || 0;
  const payload       = data?.salesProductFind?.payload || [];

  return { fetchProducts, productList: payload, loading, error };
}
