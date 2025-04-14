import { useState, useReducer, useContext } from 'react'

import { SalesOrderContext } from '../../context/SalesOrderContext';
import { SalesOrderProductTableItem } from './SalesOrderProductTableItem';

export const SalesOrderProductTable = () => {

  // * hooks
  const { obj } = useContext(SalesOrderContext);
  const [selectedRow, setSelectedRow] = useState(null);

  console.log(`rendered...`);
  
  // * handles
  const handleRowClick = (item) => {
    setSelectedRow(item.key); // Set the selected row ID
  }

  // * return component
  return (
    <div className='border rounded'>
      <table className="table table-sm">
        <thead className="custom-table-head" style={{ position: "sticky", top: 0 }}>
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
            obj.productList.map((value) => (
              <SalesOrderProductTableItem key={value.key} value={value} selectedRow={selectedRow} onNotifyClick={handleRowClick}/>
            ))
          }
        </tbody>
      </table>
    </div>
  )
}
