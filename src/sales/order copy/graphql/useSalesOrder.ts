import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { ResponseInterface } from "../../../common/graphql/response";
import { SalesOrderInterface } from "../interfaces";

// * hooks
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

// * GraphQL Queries
const SEARCH_ORDERS = gql`
  query SalesOrderSearchByValues($createdAtInit: String, $createdAtEnd: String, $code: String, $customerNameIdDoc: String, $comment: String) {
    salesOrderSearchByValues(createdAtInit: $createdAtInit, createdAtEnd: $createdAtEnd, code: $code, customerNameIdDoc: $customerNameIdDoc, comment: $comment) {
      internalCode
      message
      qty
      payload {
        id
        code
        companyId
        customerIdDoc
        customerName
        customerEmail
        customerPhone
        customerAddress
        comment
        price
        cost
        discount
        discountPct
        createdAt
        status
        productList {
          id
          qty
          comment
          name
          code
          cost
          price
          discount
          discountPct
          status
        }
      }
    }
  }
`;

const UPDATE_ORDER = gql`
  mutation Update($input: SalesOrderInput!) {
    salesOrderUpdate(order: $input) {
      internalCode
      message
      qty
      payload {
        id
        code
        customerIdDoc
        customerName
        customerEmail
        customerPhone
        customerAddress
        comment
        cost
        price
        createdAt
        status
        productList {
          id
          name
          code
          cost
          price
          qty
          comment
          discount
          discountPct
          status
        }
      }
    }
  }
`;

// * interfaces
interface ResponseSalesOrderSearchByValues {
  salesOrderSearchByValues: ResponseInterface<SalesOrderInterface[]>;
}

interface ResponseSalesOrderUpdate {
  salesOrderUpdate: ResponseInterface<SalesOrderInterface[]>;
}