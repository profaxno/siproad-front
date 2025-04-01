import React, { useEffect, useState } from 'react'
import { SalesOrderProductTableItem } from './SalesOrderProductTableItem'

export const SalesOrderProductTable = ({orderProductList = [], onNotifyUpdateOrderProduct}) => {

  console.log(`rendered... orderProductList=${JSON.stringify(orderProductList)}`);
  
  return (
    <table className="table table-striped table-bordered table-sm">
      <thead className="table-dark">
        <tr style={{ textAlign: "center" }}>
          <th style={{ width: "5%" }}></th>
          <th style={{ width: "10%" }}>Codigo</th>
          <th style={{ width: "30%" }}>Producto</th>
          <th style={{ width: "10%" }}>Cantidad</th>
          <th style={{ width: "15%" }}>Precio</th>
          <th style={{ width: "15%" }}>Descuento</th>
          <th style={{ width: "15%" }}>Sub-Total</th>
        </tr>
      </thead>

      <tbody>
        {
          orderProductList.map((value) => (
            <SalesOrderProductTableItem key={value.key} orderProduct={value} onNotifyUpdateOrderProduct={onNotifyUpdateOrderProduct}/>
          ))
        }
      </tbody>
    </table>
  )
}
