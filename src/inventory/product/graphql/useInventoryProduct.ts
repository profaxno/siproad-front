import { gql, useLazyQuery, useMutation } from "@apollo/client";

import { ResponseInterface } from "../../../common/graphql/response";

import { InventoryProductInterface } from "../interfaces";

// * hooks
export const useSearchProduct = () => {
 
  const [fetchProducts, { data, loading, error }] = useLazyQuery<ResponseInventoryProductSearchByValues>(SEARCH_PRODUCTS, {
    fetchPolicy: "no-cache",
  });

  const inventoryProductSearchByValues = data?.inventoryProductSearchByValues;

  return {
    fetchProducts,
    inventoryProductSearchByValues,
    loading,
    errorInventoryProductSearchByValues: error,
  };
  
};

export const useUpdateProduct = () => {

  const [mutateUpdateProduct, { data, loading, error }] = useMutation<ResponseInventoryProductUpdate>(UPDATE_PRODUCT);

  const inventoryProductUpdate = data?.inventoryProductUpdate;

  return { 
    mutateUpdateProduct, 
    inventoryProductUpdate, 
    loading, 
    errorInventoryProductUpdate: error 
  };

};

export const useDeleteProduct = () => {

  const [mutateDeleteProduct, { data, loading, error }] = useMutation<ResponseInventoryProductDelete>(DELETE_PRODUCT);

  const inventoryProductDelete = data?.inventoryProductDelete;

  return { 
    mutateDeleteProduct, 
    inventoryProductDelete, 
    loading, 
    errorInventoryProductDelete: error 
  };
  
};

// * GraphQL Queries
const SEARCH_PRODUCTS = gql`
  query InventoryProductSearchByValues($nameCode: String, $productTypeList: [Float!], $productCategoryId: String) {
    inventoryProductSearchByValues(nameCode: $nameCode, productTypeList: $productTypeList, productCategoryId: $productCategoryId) {
      internalCode
      message
      qty
      payload {
        id
        productCategoryId
        name
        code
        description
        unit
        cost
        price
        type
        enable4Sale
        companyId
        elementList {
          element {
            id
            productCategoryId
            name
            code
            description
            unit
            cost
            price
            type
            enable4Sale
            companyId
            elementList {
              element {
                id
                productCategoryId
                name
                code
                description
                unit
                cost
                price
                type
                enable4Sale
                companyId
              }
              qty
            }
          }
          qty
        }
      }
    }
  }
`;

const UPDATE_PRODUCT = gql`
  mutation InventoryProductUpdate($input: InventoryProductInput!) {
    inventoryProductUpdate(product: $input) {
      internalCode
      message
      qty
      payload {
        id
        productCategoryId
        name
        code
        description
        unit
        cost
        price
        type
        enable4Sale
        companyId
        elementList {
          element {
            id
            productCategoryId
            name
            code
            description
            unit
            cost
            price
            type
            enable4Sale
            companyId
            elementList {
              qty
              element {
                id
                productCategoryId
                name
                code
                description
                unit
                cost
                price
                type
                enable4Sale
                companyId
              }
            }
          }
        }
      }
    }
  }
`;

const DELETE_PRODUCT = gql`
  mutation InventoryProductDelete($id: String!) {
    inventoryProductDelete(id: $id) {
      internalCode
      message
    }
  }
`;

// * interfaces
interface ResponseInventoryProductSearchByValues {
  inventoryProductSearchByValues: ResponseInterface<InventoryProductInterface[]>;
}

interface ResponseInventoryProductUpdate {
  inventoryProductUpdate: ResponseInterface<InventoryProductInterface[]>;
}

interface ResponseInventoryProductDelete {
  inventoryProductDelete: ResponseInterface<any>;
}