import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { AdminDocumentTypeInterface } from "../interfaces";
import { ResponseInterface } from "../../../common/graphql/response";

// * hooks
export const useSearch = () => {

  const [fetch, { data, loading, error }] = useLazyQuery<ResponseSearchByValues>(SEARCH, {
    fetchPolicy: "no-cache",
  });

  const searchByValuesResponse = data?.adminDocumentTypeSearchByValues;

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
  query AdminDocumentTypeSearchByValues($name: String, $page: Float, $limit: Float) {
    adminDocumentTypeSearchByValues(name: $name, page: $page, limit: $limit) {
      internalCode
      message
      qty
      payload {
        id
        name
        companyId
      }
    }
  }
`;

const UPDATE = gql`
  mutation AdminDocumentTypeUpdate($documentType: AdminDocumentTypeInput!) {
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
  mutation AdminDocumentTypeDelete($adminDocumentTypeDeleteId: String!) {
    adminDocumentTypeDelete(id: $adminDocumentTypeDeleteId) {
      internalCode
      message
    }
  }
`;

// * interfaces
interface ResponseSearchByValues {
  adminDocumentTypeSearchByValues: ResponseInterface<AdminDocumentTypeInterface[]>;
}

interface ResponseUpdate {
  adminDocumentTypeUpdate: ResponseInterface<AdminDocumentTypeInterface[]>;
}

interface ResponseDelete {
  adminDocumentTypeDelete: ResponseInterface<any>;
}