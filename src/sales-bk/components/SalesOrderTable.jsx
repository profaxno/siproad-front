import React, { useEffect, useState } from 'react'
import { SalesOrderTableItem } from './SalesOrderTableItem'

export const SalesOrderTable = ({orderList = [], onNotifyUpdateOrder, onNotifySelectOrder}) => {

  // * hooks
  const [selectedRow, setSelectedRow] = useState(null);
  
  console.log(`rendered... orderList=${JSON.stringify(orderList)}`);
  
  // * handles
  const handleRowClick = (item) => {
    setSelectedRow(item.id); // Set the selected row ID
  }

  // * return component
  return (
    <table className="table table-md table-striped table-bordered">
    {/* <table className="table table-striped table-bordered table-sm"> */}
      <thead className="table-dark" style={{ position: "sticky", top: 0 }}>
        <tr style={{ textAlign: "center" }}>
        <th style={{ width: "5%" }}></th>
          <th style={{ width: "28%" }}>Creación</th>
          <th style={{ width: "12%" }}>Código</th>
          <th style={{ width: "20%" }}>Cliente</th>
          <th style={{ width: "35%" }}>Comentarios</th>
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
