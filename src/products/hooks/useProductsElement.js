import { useLazyQuery } from "@apollo/client";

import { GET_ELEMENTS } from "../graphql/products-element-queries";

export const useSearchElements = () => {
  
  const [fetchElements, { data, loading, error }] = useLazyQuery(GET_ELEMENTS, {
    fetchPolicy: "no-cache",
  });

  const payload = data?.productsElementFind?.payload || [];

  return { fetchElements, elementList: payload, loading, error };
}