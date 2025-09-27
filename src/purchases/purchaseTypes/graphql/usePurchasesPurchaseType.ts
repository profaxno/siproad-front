import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { PurchasesPurchaseTypeInterface } from "../interfaces";
import { ResponseInterface } from "../../../common/graphql/response";

// * hooks
export const useSearch = () => {

  const [fetch, { data, loading, error }] = useLazyQuery<ResponseSearchByValues>(SEARCH, {
    fetchPolicy: "no-cache",
  });

  const searchByValuesResponse = data?.purchasesPurchaseTypeSearchByValues;

  return {
    fetch,
    searchByValuesResponse,
    loading,
    errorPurchasesOrderSearchByValues: error,
  }
  
}

export const useUpdate = () => {

  const [mutateUpdate, { data, loading, error }] = useMutation<ResponseUpdate>(UPDATE);

  const updateResponse = data?.adminDocumentTypeUpdate;

  return { 
    mutateUpdate, 
    updateResponse, 
    loading, 
    errorProductsProductUpdate: error 
  }

}

export const useDelete = () => {

  const [mutateDelete, { data, loading, error }] = useMutation<ResponseDelete>(DELETE);

  const deleteResponse = data?.adminDocumentTypeDelete;

  return { 
    mutateDelete, 
    deleteResponse, 
    loading, 
    errorProductsProductDelete: error 
  }
  
}

// * GraphQL Queries
export const SEARCH = gql`
  query PurchasesPurchaseTypeSearchByValues($name: String, $page: Float, $limit: Float) {
    purchasesPurchaseTypeSearchByValues(name: $name, page: $page, limit: $limit) {
      internalCode
      message
      qty
      payload {
        name
        id
        companyId
      }
    }
  }  
`;

const UPDATE = gql`
  mutation PurchasesPurchaseTypeUpdate($documentType: PurchasesPurchaseTypeInput!) {
    adminDocumentTypeUpdate(documentType: $documentType) {
      internalCode
      message
      qty
      payload {
        id
        companyId
        name
      }
    }
  }
`;

const DELETE = gql`
  mutation PurchasesPurchaseTypeDelete($adminDocumentTypeDeleteId: String!) {
    adminDocumentTypeDelete(id: $adminDocumentTypeDeleteId) {
      internalCode
      message
    }
  }
`;

// * interfaces
interface ResponseSearchByValues {
  purchasesPurchaseTypeSearchByValues: ResponseInterface<PurchasesPurchaseTypeInterface[]>;
}

interface ResponseUpdate {
  adminDocumentTypeUpdate: ResponseInterface<PurchasesPurchaseTypeInterface[]>;
}

interface ResponseDelete {
  adminDocumentTypeDelete: ResponseInterface<any>;
}