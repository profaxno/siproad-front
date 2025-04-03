import { useMutation, useLazyQuery } from "@apollo/client";
import { UPDATE_ORDER } from "../graphql/mutation-sales-order";
import { GET_ORDERS } from "../graphql/query-sales-order";

export const useUpdateOrder = () => {

  const [mutateOrder, { data, loading, error }] = useMutation(UPDATE_ORDER);

  // const internalCode  = data?.salesProductFind?.internalCode || '';
  // const message       = data?.salesProductFind?.message || '';
  // const qty           = data?.salesProductFind?.qty || 0;
  // const payload       = data?.salesProductFind?.payload || [];

  return { mutateOrder, data, loading, error };
}

export const useSearchOrder = () => {
  const [fetchOrders, { data, loading, error }] = useLazyQuery(GET_ORDERS);

  // const internalCode  = data?.salesProductFind?.internalCode || '';
  // const message       = data?.salesProductFind?.message || '';
  // const qty           = data?.salesProductFind?.qty || 0;
  const payload       = data?.salesProductFind?.payload || [];

  return { fetchOrders, orderList: payload, loading, error };
}
