import { useState, useContext } from 'react';
import type { FC } from 'react';

import { PurchasesOrderContext } from '../context/PurchasesOrderContext';
import { PurchasesOrderProductTableItem } from './PurchasesOrderProductTableItem';
import { FormPurchasesOrderProductInterface } from '../interfaces';

export const PurchasesOrderProductTable: FC = () => {

  // * hooks
  const context = useContext(PurchasesOrderContext);
  if (!context) 
    throw new Error("PurchasesOrderProductTable: PurchasesOrderContext must be used within an PurchasesOrderProvider");
  
  const { form } = context;
  const [selectedRow, setSelectedRow] = useState<string>("");

  // * handles
  const handleRowClick = (formOrderProduct: FormPurchasesOrderProductInterface) => setSelectedRow(formOrderProduct.key);

  // * return component
  return (
    <div>
      <table className="table table-sm">
        <thead className="custom-table-head" style={{ position: 'sticky', top: 0 }}>
          <tr style={{ textAlign: 'center' }}>
            <th style={{ width: '5%' }}></th>
            <th style={{ width: '10%' }}>Código</th>
            <th style={{ width: '35%' }}>Producto</th>
            <th style={{ width: '10%' }}>Cantidad</th>
            <th style={{ width: '15%' }}>Monto</th>
            {/* <th style={{ width: '10%' }}>Descuento</th>
            <th style={{ width: '15%' }}>SubTotal</th> */}
          </tr>
        </thead>

        <tbody>
          { 
            form.productList.map((value) => (
              <PurchasesOrderProductTableItem
                key={value.key}
                value={value}
                selectedRow={selectedRow}
                onNotifyClick={handleRowClick}
              />
            ))
          }
        </tbody>
      </table>
    </div>
  );
};
