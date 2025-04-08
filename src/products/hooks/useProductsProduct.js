import { useLazyQuery, useMutation } from "@apollo/client";

import { GET_PRODUCTS } from "../graphql/products-product-queries";
import { UPDATE_PRODUCT, DELETE_PRODUCT } from "../graphql/products-product-mutation";

export const useSearchProduct = () => {
  
  const [fetchProducts, { data, loading, error }] = useLazyQuery(GET_PRODUCTS, {
    fetchPolicy: "no-cache",
  });

  const payload = data?.productsProductFind?.payload || [];

  return { fetchProducts, productList: payload, loading, error };
}

export const useUpdateProduct = () => {

  const [mutateProduct, { data, loading, error }] = useMutation(UPDATE_PRODUCT);
  
  return { mutateProduct, data, loading, error };
}

export const useDeleteProduct = () => {

  const [mutateDeleteProduct, { data, loading, error }] = useMutation(DELETE_PRODUCT);
  
  return { mutateDeleteProduct, data, loading, error };
}

