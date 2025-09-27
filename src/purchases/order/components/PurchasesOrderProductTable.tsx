import { useState, useContext } from 'react';
import type { FC } from 'react';

import { purchasesOrderContext } from '../context/purchases-order.context';
import { PurchasesOrderProductTableItem } from './PurchasesOrderProductTableItem';
import { FormPurchasesOrderProductDto } from '../dto';

export const PurchasesOrderProductTable: FC = () => {

  // * hooks
  const context = useContext(purchasesOrderContext);
  if (!context) 
    throw new Error("PurchasesOrderProductTable: PurchasesOrderContext must be used within an PurchasesOrderProvider");
  
  const { form } = context;
  const [selectedRow, setSelectedRow] = useState<string>("");

  // * handles
  const handleRowClick = (formOrderProduct: FormPurchasesOrderProductDto) => setSelectedRow(formOrderProduct.key);

  // * return component
  return (
    <div>
      <table className="table table-sm">
        <thead className="custom-table-head" style={{ position: 'sticky', top: 0 }}>
          <tr style={{ textAlign: 'center' }}>
            <th style={{ width: '5%' }}></th>
            <th style={{ width: '10%' }}>Código</th>
            <th style={{ width: '30%' }}>Producto</th>
            <th style={{ width: '15%' }}>Costo Actual</th>
            <th style={{ width: '15%' }}>Costo Nuevo</th>
            <th style={{ width: '10%' }}>Cantidad</th>
            <th style={{ width: '15%' }}>Monto</th>
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
