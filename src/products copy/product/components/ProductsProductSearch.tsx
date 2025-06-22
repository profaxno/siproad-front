import type { FC } from "react";
import { ChangeEvent, useContext, useEffect } from 'react';

import { v4 as uuidv4 } from 'uuid';

import { TableActionEnum } from '../../../common/enums/table-actions.enum';

import { ProductsProductContext } from '../context/ProductsProductContext';
import { FormProductsProductInterface, FormProductsProductElementInterface, ProductsProductInterface } from '../interfaces';
import { ProductsProductElementInterface } from '../interfaces/products-product.interface';
import { ProductsElementUnitEnum } from "../../element/enums/products-element-unit.enum";
import { ActiveStatusEnum } from "../../../common/enums";

export const ProductsProductSearch: FC = () => {

  // * hooks
  const context = useContext(ProductsProductContext);
  if (!context) 
    throw new Error("ProductsProductSearch: ProductsProductContext must be used within an ProductsProductProvider");

  const { formSearch, setFormSearch, searchProducts, mapObjToForm, updateTable } = context;

  useEffect(() => {
    search();
  }, [formSearch]);

  // * handles
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormSearch({ ...formSearch, [name]: value });
  };

  const search = () => {
    const nameCode      = formSearch.nameCode?.length           > 3 ? formSearch.nameCode           : undefined;
    const productTypeId = formSearch.productCategoryId?.length  > 0 ? formSearch.productCategoryId  : undefined;

    if( !(nameCode || productTypeId) ) {
      updateTable(TableActionEnum.LOAD, []);
      return;
    }

    searchProducts(nameCode, undefined, productTypeId)
    .then( (productList: ProductsProductInterface[]) => {

      const formProductList: FormProductsProductInterface[] = productList.map( (inventoryProduct: ProductsProductInterface) => mapObjToForm(inventoryProduct, 0) );
      updateTable(TableActionEnum.LOAD, formProductList);

    })
    .catch( () => {
      updateTable(TableActionEnum.LOAD, []);
      // setScreenMessage({type: "error", title: "Problema", message: 'No se completó la operación, intente de nuevo', show: true});
    });
    
  };

  // * return component
  return (
    <div className="bproduct rounded p-3 mb-2">
      <div className="d-flex gap-1 mb-2">
       
        <div className="col-6 flex-wrap">
          <label className="form-label text-end">Producto:</label>

          <input
            type="text"
            name="nameCode"
            className={"form-control"} 
            value={formSearch.nameCode}
            onChange={handleChange}
            // onKeyDown={handleKeyDown}
            placeholder={"Nombre o Código..."}
            autoComplete="off"
            maxLength={50}
          />
        </div>

      </div>
    </div>
  );
};
