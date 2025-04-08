import React, { useContext, useEffect } from 'react'

import { ProductsProductContext } from '../../../context/ProductsProductContext';
import { ProductsProductTableItem } from './ProductsProductTableItem';

export const ProductsProductTable = () => {

  // * hooks
  const { objList = [] } = useContext(ProductsProductContext);
    
  console.log(`rendered... objList=(${objList.length})${JSON.stringify(objList)}`);

  // * handles
  
  // * return component
  return (
    <table className="table table-md table-striped table-bordered">
      <thead className="table-dark" style={{ position: "sticky", top: 0 }}>
        <tr style={{ textAlign: "center" }}>
          <th style={{ width: "5%" }}></th>
          <th style={{ width: "15%" }}>Código</th>
          <th style={{ width: "37%" }}>Nombre</th>
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
  )
}
