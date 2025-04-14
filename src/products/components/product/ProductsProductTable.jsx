import React, { useContext, useEffect } from 'react'

import { ProductsProductContext } from '../../context/ProductsProductContext';
import { ProductsProductTableItem } from './ProductsProductTableItem';

export const ProductsProductTable = () => {

  // * hooks
  const { objList = [] } = useContext(ProductsProductContext);
    
  console.log(`rendered... objList=(${objList.length})${JSON.stringify(objList)}`);

  // * handles
  
  // * return component
  return (
    <div className='border rounded'>
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
            objList.map((value) => (
              <ProductsProductTableItem key={value.key} value={value}/>
            ))
          }
        </tbody>
      </table>
    </div>
  )
}
