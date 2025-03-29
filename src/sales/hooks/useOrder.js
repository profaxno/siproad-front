import { useMutation } from "@apollo/client";
import { UPDATE_ORDER } from "../graphql/mutation-sales-order";

export const useOrder = () => {

  const [createOrder, { data, loading, error }] = useMutation(UPDATE_ORDER);

  // const internalCode  = data?.salesProductFind?.internalCode || '';
  // const message       = data?.salesProductFind?.message || '';
  // const qty           = data?.salesProductFind?.qty || 0;
  // const payload       = data?.salesProductFind?.payload || [];

  return { createOrder, data, loading, error };
}
