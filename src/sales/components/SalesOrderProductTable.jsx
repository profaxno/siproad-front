import React, { useEffect, useState } from 'react'
import { SalesOrderProductTableItem } from './SalesOrderProductTableItem'

export const SalesOrderProductTable = ({orderProductList = [], onNotifyUpdateOrderProduct}) => {

  console.log(`rendered... orderProductList=${JSON.stringify(orderProductList)}`);

  return (
    <table className="table table-striped table-bordered">
      <thead className="table-dark	">
        <tr>
          <th style={{ width: "30%" }}>Producto</th>
          <th style={{ width: "10%" }}>Cantidad</th>
          <th style={{ width: "20%" }}>Precio</th>
          <th style={{ width: "20%" }}>Descuento</th>
          <th style={{ width: "20%" }}>SubTotal</th>
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
