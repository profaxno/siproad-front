import React, { useEffect, useState } from 'react'
import { SalesOrderTableItem } from './SalesOrderTableItem'

export const SalesOrderTable = ({orderList = [], onNotifyUpdateOrder, onNotifySelectOrder}) => {

  const [selectedRow, setSelectedRow] = useState(null);
  
  console.log(`rendered... orderList=${JSON.stringify(orderList)}`);
  
  const handleRowClick = (item) => {
    setSelectedRow(item.id); // Set the selected row ID
  }

  return (
    <table className="table table-striped table-bordered table-sm">
      <thead className="table-dark">
        <tr style={{ textAlign: "center" }}>
        <th style={{ width: "5%" }}></th>
          <th style={{ width: "28%" }}>F. Creación</th>
          <th style={{ width: "12%" }}>Codigo</th>
          <th style={{ width: "20%" }}>Cliente</th>
          <th style={{ width: "35%" }}>Descripción</th>
        </tr>
      </thead>

      <tbody>
        {
          orderList.map((value) => (
            <SalesOrderTableItem key={value.id} order={value} onNotifyUpdateObject={onNotifyUpdateOrder} onNotifySelectObject={onNotifySelectOrder} onClick={handleRowClick} selectedRow={selectedRow}/>
          ))
        }
      </tbody>
    </table>
  )
}
