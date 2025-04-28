import { useState, useContext } from 'react';
import type { FC } from 'react';

import { ProductsProductContext } from '../context/ProductsProductContext';
import { ProductsProductElementTableItem } from './ProductsProductElementTableItem';
import { FormProductsProductElementInterface } from '../interfaces';

export const ProductsProductElementTable: FC = () => {

  // * hooks
  const context = useContext(ProductsProductContext);
  if (!context) 
    throw new Error("ProductsProductElementTable: ProductsProductContext must be used within an ProductsProductProvider");
  
  const { form } = context;
  const [selectedRow, setSelectedRow] = useState<string>("");

  // * handles
  const handleRowClick = (formProductElement: FormProductsProductElementInterface) => setSelectedRow(formProductElement.key);

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
            form.elementList.map((value) => (
              <ProductsProductElementTableItem key={value.key} value={value} selectedRow={selectedRow} onNotifyClick={handleRowClick}/>
            ))
          }
        </tbody>
      </table>
    </div>
  );
};
