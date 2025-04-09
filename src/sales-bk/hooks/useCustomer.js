import { useLazyQuery } from "@apollo/client";
import { GET_PRODUCTS } from "../graphql/query-product";

export const useCustomer = () => {
  const [fetchCustomers, { data, loading, error }] = useLazyQuery(GET_PRODUCTS);

  const internalCode  = data?.salesCustomerFind?.internalCode || '';
  const message       = data?.salesCustomerFind?.message || '';
  const qty           = data?.salesCustomerFind?.qty || 0;
  const payload       = data?.salesCustomerFind?.payload || [];

  return { fetchCustomers, productList: payload, loading, error };
}
