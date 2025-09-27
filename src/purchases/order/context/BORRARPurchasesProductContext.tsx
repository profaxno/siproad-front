import type { FC } from "react";
import { ReactNode, createContext } from 'react';

import { PurchasesProductInterface } from '../interfaces';
import { useSearchProduct } from '../graphql/BORRARusePurchasesProduct';
import { ProductTypeEnum } from "../../../products/product/enums/product-type.enum";

// * context
interface PurchasesProductContextType {
  searchProducts: (nameCode: string) => Promise<PurchasesProductInterface[]>;
}

export const PurchasesProductContext = createContext<PurchasesProductContextType | undefined>(undefined);


// * provider
interface Props {
  children: ReactNode;
}

export const PurchasesProductProvider: FC<Props> = ({ children }) => {
  
  const { fetchProducts } = useSearchProduct();
  

  const searchProducts = (nameCode: string): Promise<PurchasesProductInterface[]> => {
    
    const nameCodeList = [nameCode];
    const productTypeList = [ProductTypeEnum.P];

    return fetchProducts({ variables: { nameCodeList, productTypeList } })
    .then( (response) => {

      const { purchasesProductSearchByValues } = response.data || {};
      const { internalCode = 0, message, payload = [] } = purchasesProductSearchByValues || {};

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
    <PurchasesProductContext.Provider
      value={{
        searchProducts
      }}
    >
      {children}
    </PurchasesProductContext.Provider>
  );
};
