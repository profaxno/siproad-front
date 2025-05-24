import { useState, useContext } from 'react';
import type { FC } from 'react';

import { SalesOrderContext } from '../context/SalesQuotationContext';
import { SalesOrderProductTableItem } from './SalesOrderProductTableItem';
import { FormSalesOrderProductInterface } from '../interfaces';

export const SalesOrderProductTable: FC = () => {

  // * hooks
  const context = useContext(SalesOrderContext);
  if (!context) 
    throw new Error("SalesOrderProductTable: SalesOrderContext must be used within an SalesOrderProvider");
  
  const { form } = context;
  const [selectedRow, setSelectedRow] = useState<string>("");

  // * handles
  const handleRowClick = (formOrderProduct: FormSalesOrderProductInterface) => setSelectedRow(formOrderProduct.key);

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
            <th style={{ width: '15%' }}>Precio</th>
            <th style={{ width: '10%' }}>Descuento</th>
            <th style={{ width: '15%' }}>SubTotal</th>
          </tr>
        </thead>

        <tbody>
          { 
            form.productList.map((value) => (
              <SalesOrderProductTableItem
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
