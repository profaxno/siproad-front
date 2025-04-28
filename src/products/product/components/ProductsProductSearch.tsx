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

  const { formSearch, setFormSearch, searchProducts, updateTable } = context;

  useEffect(() => {
    search();
  }, [formSearch]);

  // * handles
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormSearch({ ...formSearch, [name]: value });
  };

  const search = () => {
    const nameCode      = formSearch.nameCode?.length       > 3 ? formSearch.nameCode       : undefined;
    const productTypeId = formSearch.productTypeId?.length  > 0 ? formSearch.productTypeId  : undefined;

    if( !(nameCode || productTypeId) ) {
      updateTable(TableActionEnum.LOAD, []);
      return;
    }

    searchProducts(nameCode, productTypeId)
    .then( (productList: ProductsProductInterface[]) => {

      const formProductList: FormProductsProductInterface[] = productList.map( (productsProduct: ProductsProductInterface) => {
        
        const formProductElementList: FormProductsProductElementInterface[] = productsProduct.elementList.map( (productElement: ProductsProductElementInterface) => {
          
          // * calculate subTotal for each element in the list 
          const formProductElement: FormProductsProductElementInterface ={
            key     : uuidv4(),
            id      : productElement.id,
            qty     : productElement.qty,
            name    : productElement?.name || '',
            cost    : productElement?.cost || 0,
            unit    : productElement?.unit || ProductsElementUnitEnum.UN,
            status  : ActiveStatusEnum.ACTIVE
          };

          return formProductElement;
        });
        
        return {
          id            : productsProduct.id,
          name          : productsProduct.name,
          code          : productsProduct.code,
          description   : productsProduct.description,
          cost          : productsProduct.cost,
          price         : productsProduct.price,
          imagenUrl     : productsProduct.imagenUrl,
          hasFormula    : productsProduct.hasFormula,
          productTypeId : productsProduct.productTypeId,
          elementList   : formProductElementList,
          status        : ActiveStatusEnum.ACTIVE,
          readonly      : false // TODO: este campo permite bloquear la pantalla, por lo cual cuando se utilice los permisos se puede calcular este valor.
        };
      });

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
