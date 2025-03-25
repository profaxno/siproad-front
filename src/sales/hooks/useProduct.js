import React from 'react'

export const useProduct = () => {
  const { data, loading, error } = useQuery(GET_PRODUCTS);

  const internalCode  = data?.salesProductFind?.internalCode || '';
  const message       = data?.salesProductFind?.message || '';
  const qty           = data?.salesProductFind?.qty || 0;
  const payload       = data?.salesProductFind?.payload || [];

  return { productList: payload, loading, error };
}
