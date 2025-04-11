import { useLazyQuery, useMutation } from "@apollo/client";

import { SEARCH_ORDERS } from "../graphql/sales-order-queries";
import { UPDATE_ORDER } from "../graphql/sales-order-mutation";

export const useUpdateOrder = () => {

  const [mutateOrder, { data, loading, error }] = useMutation(UPDATE_ORDER);
  
  return { mutateOrder, data, loading, error };
}

export const useSearchOrder = () => {
  
  const [fetchOrders, { data, loading, error }] = useLazyQuery(SEARCH_ORDERS, {
    fetchPolicy: "no-cache",
  });

  const payload = data?.salesOrderFind?.payload || [];

  return { fetchOrders, orderList: payload, loading, error };
}

// export const useDeleteOrder = () => {

//   const [mutateDeleteOrder, { data, loading, error }] = useMutation(DELETE_ORDER);
  
//   return { mutateDeleteOrder, data, loading, error };
// }

