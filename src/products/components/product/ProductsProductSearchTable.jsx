import React, { useContext, useEffect } from 'react'

import { ProductsProductContext } from '../../context/ProductsProductContext';
import { ProductsProductSearchTableItem } from './ProductsProductSearchTableItem';

export const ProductsProductSearchTable = () => {

  // * hooks
  const { objList = [] } = useContext(ProductsProductContext);
    
  // console.log(`rendered... objList=(${objList.length})${JSON.stringify(objList)}`);

  // * handles
  
  // * return component
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
            objList.map((value) => (
              <ProductsProductSearchTableItem key={value.key} value={value}/>
            ))
          }
        </tbody>
      </table>
    </div>
  )
}
