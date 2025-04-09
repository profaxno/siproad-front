import React, { useContext, useEffect } from 'react'

import { SalesOrderContext } from '../../context/SalesOrderContext';
import { SalesOrderTableItem } from './SalesOrderTableItem';

export const SalesOrderTable = () => {

  // * hooks
  const { objList = [] } = useContext(SalesOrderContext);
    
  console.log(`rendered... objList=(${objList.length})${JSON.stringify(objList)}`);

  // * handles
  
  // * return component
  return (
    <table className="table table-md table-striped table-bordered">
      <thead className="table-dark" style={{ position: "sticky", top: 0 }}>
        <tr style={{ textAlign: "center" }}>
          <th style={{ width: "30%" }}>Creación</th>
          <th style={{ width: "15%" }}>Código</th>
          <th style={{ width: "20%" }}>Cliente</th>
          <th style={{ width: "35%" }}>Comentarios</th>
        </tr>
      </thead>

      <tbody>
        {
          objList.map((value) => (
            <SalesOrderTableItem key={value.key} value={value}/>
          ))
        }
      </tbody>
    </table>
  )
}
