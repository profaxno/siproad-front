import { useState, useReducer, useContext } from 'react'

import { ProductsProductContext } from '../../../context/ProductsProductContext';
import { ProductsProductElementTableItem } from './ProductsProductElementTableItem';
import { tableReducer } from '../../../context/TableReducer';

export const ProductsProductElementTable = () => {

  // * hooks
  const { obj } = useContext(ProductsProductContext);
  const [selectedRow, setSelectedRow] = useState(null);

  console.log(`rendered... value=(${obj.elementList.length})${JSON.stringify(obj.elementList)}`);
  
  // * handles
  const handleRowClick = (item) => {
    setSelectedRow(item.key); // Set the selected row ID
  }

  // * return component
  return (
    <table className="table table-striped table-bordered table-sm">
      <thead className="table-dark" style={{ position: "sticky", top: 0 }}>
        <tr style={{ textAlign: "center" }}>
          <th style={{ width: "5%" }}></th>
          <th style={{ width: "55%" }}>Nombre</th>
          <th style={{ width: "25%" }}>Cantidad</th>
          <th style={{ width: "15%" }}>Unidad</th>
        </tr>
      </thead>

      <tbody>
        {
          obj.elementList.map((value) => (
            <ProductsProductElementTableItem key={value.key} value={value} selectedRow={selectedRow} onNotifyClick={handleRowClick}/>
          ))
        }
      </tbody>
    </table>
  )
}
