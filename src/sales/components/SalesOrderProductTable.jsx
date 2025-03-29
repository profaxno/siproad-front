import React, { useEffect, useState } from 'react'
import { SalesOrderProductTableItem } from './SalesOrderProductTableItem'

export const SalesOrderProductTable = ({orderProductList = [], onNotifyUpdateOrderProduct}) => {

  console.log(`rendered... orderProductList=${JSON.stringify(orderProductList)}`);

  
  return (
    <table className="table table-striped table-bordered">
      <thead className="table-dark">
        <tr style={{ textAlign: "center" }}>
          <th style={{ width: "36%" }}>Producto</th>
          <th style={{ width: "10%" }}>Cantidad</th>
          <th style={{ width: "18%" }}>Precio</th>
          <th style={{ width: "18%" }}>Descuento</th>
          <th style={{ width: "18%" }}>Sub-Total</th>
        </tr>
      </thead>

      <tbody>
        {
          orderProductList.map((orderProduct) => (
            <SalesOrderProductTableItem key={orderProduct.key} orderProduct={orderProduct} onNotifyUpdateOrderProduct={onNotifyUpdateOrderProduct}/>
          ))
        }
      </tbody>
    </table>
  )
}
