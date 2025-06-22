import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { ResponseInterface } from "../../../common/graphql/response";
import { PurchasesOrderInterface } from "../interfaces";

// * hooks
export const useSearchOrder = () => {

  const [fetchOrders, { data, loading, error }] = useLazyQuery<ResponsePurchasesOrderSearchByValues>(SEARCH_ORDERS, {
    fetchPolicy: "no-cache",
  });

  const purchasesOrderSearchByValues = data?.purchasesOrderSearchByValues;

  return {
    fetchOrders,
    purchasesOrderSearchByValues,
    loading,
    errorPurchasesOrderSearchByValues: error,
  };
  
};

export const useUpdateOrder = () => {

  const [mutateOrder, { data, loading, error }] = useMutation<ResponsePurchasesOrderUpdate>(UPDATE_ORDER);

  const purchasesOrderUpdate = data?.purchasesOrderUpdate;

  return { 
    mutateOrder, 
    purchasesOrderUpdate, 
    loading, 
    errorPurchasesOrderUpdate: error 
  };
};

// * GraphQL Queries
const SEARCH_ORDERS = gql`
  query PurchasesOrderSearchByValues($createdAtInit: String, $createdAtEnd: String, $code: String, $providerNameIdDoc: String, $comment: String) {
    purchasesOrderSearchByValues(createdAtInit: $createdAtInit, createdAtEnd: $createdAtEnd, code: $code, providerNameIdDoc: $providerNameIdDoc, comment: $comment) {
      internalCode
      message
      qty
      payload {
        companyId
        id
        code
        purchaseTypeId
        documentTypeId
        providerIdDoc
        providerName
        providerEmail
        providerPhone
        providerAddress
        comment
        amount
        documentNumber
        createdAt
        status
        productList {
          id
          qty
          comment
          name
          code
          cost
          amount
          status
        }
      }
    }
  }
`;

const UPDATE_ORDER = gql`
  mutation PurchasesOrderUpdate($order: PurchasesOrderInput!) {
    purchasesOrderUpdate(order: $order) {
      internalCode
      message
      qty
      payload {
        id
        code
        companyId
        userId
        purchaseTypeId
        documentTypeId
        providerIdDoc
        providerName
        providerEmail
        providerPhone
        providerAddress
        comment
        amount
        documentNumber
        createdAt
        status
        productList {
          id
          qty
          comment
          name
          code
          cost
          amount
          status
        }
      }
    }
  }
`;

// * interfaces
interface ResponsePurchasesOrderSearchByValues {
  purchasesOrderSearchByValues: ResponseInterface<PurchasesOrderInterface[]>;
}

interface ResponsePurchasesOrderUpdate {
  purchasesOrderUpdate: ResponseInterface<PurchasesOrderInterface[]>;
}