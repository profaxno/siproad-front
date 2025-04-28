import { gql, useLazyQuery, useMutation } from "@apollo/client";

import { ResponseInterface } from "../../../common/graphql/response";

import { ProductsProductInterface } from "../interfaces";

// * hooks
export const useSearchProduct = () => {
 
  const [fetchProducts, { data, loading, error }] = useLazyQuery<ResponseProductsProductSearchByValues>(SEARCH_PRODUCTS, {
    fetchPolicy: "no-cache",
  });

  const productsProductSearchByValues = data?.productsProductSearchByValues;

  return {
    fetchProducts,
    productsProductSearchByValues,
    loading,
    errorProductsProductSearchByValues: error,
  };
  
};

export const useUpdateProduct = () => {

  const [mutateUpdateProduct, { data, loading, error }] = useMutation<ResponseProductsProductUpdate>(UPDATE_PRODUCT);

  const productsProductUpdate = data?.productsProductUpdate;

  return { 
    mutateUpdateProduct, 
    productsProductUpdate, 
    loading, 
    errorProductsProductUpdate: error 
  };

};

export const useDeleteProduct = () => {

  const [mutateDeleteProduct, { data, loading, error }] = useMutation<ResponseProductsProductDelete>(DELETE_PRODUCT);

  const productsProductDelete = data?.productsProductDelete;

  return { 
    mutateDeleteProduct, 
    productsProductDelete, 
    loading, 
    errorProductsProductDelete: error 
  };
  
};

// * GraphQL Queries
const SEARCH_PRODUCTS = gql`
  query ProductProductSearchByValues($nameCode: String, $productTypeId: String) {
    productsProductSearchByValues(nameCode: $nameCode, productTypeId: $productTypeId) {
      internalCode
      message
      qty
      payload {
        id
        name
        code
        description
        cost
        price
        hasFormula
        companyId
        elementList {
          id
          qty
          name
          cost
          unit
        }
      }
    }
  }
`;

const UPDATE_PRODUCT = gql`
  mutation Update($input: ProductsProductInput!) {
    productsProductUpdate(product: $input) {
      internalCode
      message
      qty
      payload {
        id
        companyId
        name
        code
        description
        cost
        price
        hasFormula
        elementList {
          id
          qty
          name
          cost
          unit
        }
      }
    }
  }
`;

const DELETE_PRODUCT = gql`
  mutation ProductsProductDelete($id: String!) {
    productsProductDelete(id: $id) {
      internalCode
      message
    }
  }
`;

// * interfaces
interface ResponseProductsProductSearchByValues {
  productsProductSearchByValues: ResponseInterface<ProductsProductInterface[]>;
}

interface ResponseProductsProductUpdate {
  productsProductUpdate: ResponseInterface<ProductsProductInterface[]>;
}

interface ResponseProductsProductDelete {
  productsProductDelete: ResponseInterface<any>;
}