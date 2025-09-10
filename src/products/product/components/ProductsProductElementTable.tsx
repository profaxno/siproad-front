import { useState, useContext } from 'react';
import type { FC } from 'react';

import { productsProductContext } from '../context/products-product.context';
import { ProductsProductElementTableItem } from './';
import { FormProductsProductElementDto } from '../dto';

export const ProductsProductElementTable: FC = () => {

  // * hooks
  const context = useContext(productsProductContext);
  if (!context) 
    throw new Error("ProductsProductElementTable: productsProductContext must be used within an ProductsProductProvider");
    
  const { form } = context;
  const [selectedRow, setSelectedRow] = useState<string>("");

  // * handles
  const handleRowClick = (formProductElement: FormProductsProductElementDto) => setSelectedRow(formProductElement.key);

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
              <ProductsProductElementTableItem 
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
