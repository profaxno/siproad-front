import { useMutation, useLazyQuery } from "@apollo/client";
import { UPDATE_ORDER } from "../graphql/mutation-sales-order";
import { GET_ORDERS } from "../graphql/query-sales-order";

export const useUpdateOrder = () => {

  // const [mutateOrder, { data, loading, error }] = useMutation(UPDATE_ORDER, {
  //   update: (cache, { data: { updatedOrder } }) => {
  //     cache.modify({
  //       fields: {
  //         salesOrderFind(cacheOrderList = []) {
  //           console.log(`RRRRRRRRRRRRRRRRRR cacheOrderList=${JSON.stringify(cacheOrderList)}`);
  //           return cacheOrderList.map(order =>
  //             order.id === updatedOrder.id ? updatedOrder : order
  //           );
  //         }
  //       }
  //     });
  //   }
  // });

  const [mutateOrder, { data, loading, error }] = useMutation(UPDATE_ORDER);

  // const [mutateOrder, { data, loading, error }] = useMutation(UPDATE_ORDER, {
  //   refetchQueries: [{ query: GET_ORDERS }], // Vuelve a ejecutar la consulta de órdenes
  // });

  // const internalCode  = data?.salesProductFind?.internalCode || '';
  // const message       = data?.salesProductFind?.message || '';
  // const qty           = data?.salesProductFind?.qty || 0;
  // const payload       = data?.salesProductFind?.payload || [];

  return { mutateOrder, data, loading, error };
}

export const useSearchOrder = () => {
  
  const [fetchOrders, { data, loading, error }] = useLazyQuery(GET_ORDERS, {
    fetchPolicy: "no-cache",  // Evita el uso de caché
  });

  // const [fetchOrders, { data, loading, error }] = useLazyQuery(GET_ORDERS);

  // const internalCode  = data?.salesProductFind?.internalCode || '';
  // const message       = data?.salesProductFind?.message || '';
  // const qty           = data?.salesProductFind?.qty || 0;
  const payload       = data?.salesProductFind?.payload || [];

  return { fetchOrders, orderList: payload, loading, error };
}
