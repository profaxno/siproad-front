import { useState, useContext } from 'react';
import type { FC } from 'react';

import { InventoryProductContext } from '../context/InventoryProductContext';
import { InventoryProductElementTableItem } from './InventoryProductElementTableItem';
import { FormInventoryProductElementInterface } from '../interfaces';

export const InventoryProductElementTable: FC = () => {

  // * hooks
  const context = useContext(InventoryProductContext);
  if (!context) 
    throw new Error("InventoryProductElementTable: InventoryProductContext must be used within an InventoryProductProvider");
  
  const { form } = context;
  const [selectedRow, setSelectedRow] = useState<string>("");

  // * handles
  const handleRowClick = (formProductElement: FormInventoryProductElementInterface) => setSelectedRow(formProductElement.key);

  // * return component
  return (
    <div>
      <table className="table table-sm">
        <thead className="custom-table-head" style={{ position: "sticky", top: 0 }}>
          <tr style={{ textAlign: "center" }}>
            <th style={{ width: "5%" }}></th>
            <th style={{ width: "55%" }}>Nombre</th>
            <th style={{ width: "25%" }}>Cantidad</th>
            <th style={{ width: "15%" }}>Unidad</th>
          </tr>
        </thead>

        <tbody>
          {
            form.elementList?.map((value) => (
              <InventoryProductElementTableItem key={value.key} value={value} selectedRow={selectedRow} onNotifyClick={handleRowClick}/>
            ))
          }
        </tbody>
      </table>
    </div>
  );
};
