import { useContext } from 'react'
import type { FC } from 'react';

import { SalesOrderContext } from '../context/SalesOrderContext';
import { SalesOrderSearchTableItem } from './SalesOrderSearchTableItem';

export const SalesOrderSearchTable: FC = () => {

  // * hooks
  const context = useContext(SalesOrderContext);
  if (!context) 
    throw new Error("SalesOrderSearchTable: SalesOrderContext must be used within an SalesOrderProvider");
  
  const { formList } = context;
    
  // console.log(`rendered... formList=(${formList.length})${JSON.stringify(formList)}`);

  // * handles
  
  // * return component
  return (
    <>
      <table className="table">
        <thead className="custom-table-head" style={{ position: "sticky", top: 0 }}>
          <tr>
            <th style={{ width: "25%" }}>Creación</th>
            <th style={{ width: "15%" }}>Código</th>
            <th style={{ width: "15%" }}>Cliente</th>
            <th style={{ width: "30%" }}>Comentarios</th>
            <th style={{ width: "15%" }}>Estado</th>
          </tr>
        </thead>

        <tbody>
          { formList.map( (value) => <SalesOrderSearchTableItem key={value.id} value={value}/> ) }
        </tbody>
      </table>
    </>
  )
}
