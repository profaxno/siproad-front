import { useLazyQuery, useMutation } from "@apollo/client";

import { GET_ELEMENTS } from "../graphql/products-element-queries";
// import { UPDATE_PRODUCT } from "../graphql/products-product-mutation";

export const useSearchElements = () => {
  
  const [fetchElements, { data, loading, error }] = useLazyQuery(GET_ELEMENTS, {
    fetchPolicy: "no-cache",  // Evita el uso de caché
  });

  const payload = data?.productsElementFind?.payload || [];

  return { fetchElements, elementList: payload, loading, error };
}

// export const useUpdateProduct = () => {

//   const [mutateProduct, { data, loading, error }] = useMutation(UPDATE_PRODUCT);

//   return { mutateProduct, data, loading, error };
// }