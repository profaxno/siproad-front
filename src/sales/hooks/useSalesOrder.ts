import { useLazyQuery, useMutation } from "@apollo/client";

import { SEARCH_ORDERS } from "../graphql/sales-order-search-by-values.graphql";
import { UPDATE_ORDER } from "../graphql/sales-order-update.graphql";
import { ResponseSalesOrderSearchByValues } from "../graphql/sales-order-search-by-values.graphql";
import { ResponseSalesOrderUpdate } from "../graphql/sales-order-update.graphql";

export const useSearchOrder = () => {

  const [fetchOrders, { data, loading, error }] = useLazyQuery<ResponseSalesOrderSearchByValues>(SEARCH_ORDERS, {
    fetchPolicy: "no-cache",
  });

  const salesOrderSearchByValues = data?.salesOrderSearchByValues;

  return {
    fetchOrders,
    salesOrderSearchByValues,
    loading,
    errorSalesOrderSearchByValues: error,
  };
  
};

export const useUpdateOrder = () => {

  const [mutateOrder, { data, loading, error }] = useMutation<ResponseSalesOrderUpdate>(UPDATE_ORDER);

  const salesOrderUpdate = data?.salesOrderUpdate;

  return { 
    mutateOrder, 
    salesOrderUpdate, 
    loading, 
    errorSalesOrderUpdate: error 
  };
};