import { useContext } from 'react'
import type { FC } from 'react';

import { ProductsProductContext } from '../context/ProductsProductContext';
import { ProductsProductSearchTableItem } from './ProductsProductSearchTableItem';

export const ProductsProductSearchTable: FC = () => {

  // * hooks
  const context = useContext(ProductsProductContext);
  if (!context) 
    throw new Error("ProductsProductSearchTable: ProductsProductContext must be used within an ProductsProductProvider");
  
  const { formList } = context;
    
  // console.log(`rendered... formList=(${formList.length})${JSON.stringify(formList)}`);

  // * handles
  
  return (
    <div>
      <table className="table">
        <thead className="custom-table-head" style={{ position: "sticky", top: 0 }}>
          <tr style={{ textAlign: "center" }}>
            <th style={{ width: "15%" }}>Código</th>
            <th style={{ width: "42%" }}>Nombre</th>
            <th style={{ width: "15%" }}>Costo</th>
            <th style={{ width: "15%" }}>Precio</th>
            <th style={{ width: "13%" }}>Margen</th>
          </tr>
        </thead>

        <tbody>
          {
            formList.map((value) => (
              <ProductsProductSearchTableItem key={value.id} value={value}/>
            ))
          }
        </tbody>
      </table>
    </div>
  )
}
