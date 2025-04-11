import React, { useEffect, useState } from 'react'
import { SalesOrderProductTableItem } from './SalesOrderProductTableItem'

export const SalesOrderProductTable = ({orderProductList = [], onNotifyUpdateOrderProduct}) => {

  // * hooks
  const [selectedRow, setSelectedRow] = useState(null);

  console.log(`rendered...`);
  
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
          <th style={{ width: "10%" }}>Código</th>
          <th style={{ width: "30%" }}>Producto</th>
          <th style={{ width: "10%" }}>Cantidad</th>
          <th style={{ width: "15%" }}>Precio</th>
          <th style={{ width: "15%" }}>Descuento</th>
          <th style={{ width: "15%" }}>SubTotal</th>
        </tr>
      </thead>

      <tbody>
        {
          orderProductList.map((value) => (
            <SalesOrderProductTableItem key={value.key} orderProduct={value} onNotifyUpdateOrderProduct={onNotifyUpdateOrderProduct} onClick={handleRowClick} selectedRow={selectedRow}/>
          ))
        }
      </tbody>
    </table>
  )
}
