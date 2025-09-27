import { useContext } from 'react'
import type { FC } from 'react';

import { purchasesOrderContext } from '../context/purchases-order.context';
import { PurchasesOrderSearchTableItem } from './PurchasesOrderSearchTableItem';

export const PurchasesOrderSearchTable: FC = () => {

  // * hooks
  const context = useContext(purchasesOrderContext);
  if (!context) 
    throw new Error("PurchasesOrderSearchTable: PurchasesOrderContext must be used within an PurchasesOrderProvider");
  
  const { formList } = context;
    
  // console.log(`rendered... formList=(${formList.length})${JSON.stringify(formList)}`);

  // * handles
  
  // * return component
  return (
    <>
      <table className="table">
        <thead className="custom-table-head" style={{ position: "sticky", top: 0 }}>
          <tr>
            <th style={{ width: "20%" }}>Creación</th>
            <th style={{ width: "15%" }}>Código</th>
            <th style={{ width: "20%" }}>Proveedor</th>
            <th style={{ width: "15%" }}>Monto</th>
            <th style={{ width: "30%" }}>Comentarios</th>
            {/* <th style={{ width: "15%" }}>Estado</th> */}
          </tr>
        </thead>

        <tbody>
          { formList.map( (value) => <PurchasesOrderSearchTableItem key={value.id} value={value}/> ) }
        </tbody>
      </table>
    </>
  )
}
