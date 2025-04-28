import type { FC } from "react";
import { ReactNode, createContext } from 'react';

import { SalesProductInterface } from '../interfaces';
import { useSearchProduct } from '../graphql/useSalesProduct';

// * context
interface SalesProductContextType {
  searchProducts: (nameCode: string) => Promise<SalesProductInterface[]>;
}

export const SalesProductContext = createContext<SalesProductContextType | undefined>(undefined);


// * provider
interface Props {
  children: ReactNode;
}

export const SalesProductProvider: FC<Props> = ({ children }) => {
  
  const { fetchProducts } = useSearchProduct();
  

  const searchProducts = (nameCode: string): Promise<SalesProductInterface[]> => {

    const nameCodeList = [nameCode];

    return fetchProducts({ variables: { nameCodeList } })
    .then( (response) => {

      const { salesProductSearchByValues } = response.data || {};
      const { internalCode = 0, message, payload = [] } = salesProductSearchByValues || {};

      if (![200, 400, 404].includes(internalCode)) {
        throw new Error(message);
      }

      return payload;
    })
    .catch((error: any) => {
      console.error('Error searchProducts:', error);
      throw error;
    });

  };


  return (
    <SalesProductContext.Provider
      value={{
        searchProducts
      }}
    >
      {children}
    </SalesProductContext.Provider>
  );
};
