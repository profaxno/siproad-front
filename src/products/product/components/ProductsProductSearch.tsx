import type { FC } from "react";
import { ChangeEvent, useContext, useEffect } from 'react';

import { TableActionEnum } from '../../../common/enums';

import { productsProductContext } from '../context/products-product.context';
import { FormProductsProductDto } from '../dto';
import { ProductsProductInterface } from '../interfaces';
import { ProductTypeEnum } from "../enums";

interface Props {
  withMovements: boolean;
  productTypeList?: ProductTypeEnum[];
}

export const ProductsProductSearch: FC<Props> = ( { withMovements, productTypeList } ) => {

  // * hooks
  const context = useContext(productsProductContext);
  if (!context) 
    throw new Error("ProductsProductSearch: productsProductContext must be used within an ProductsProductProvider");

  const { formSearch, setFormSearch, searchProducts, mapObjToForm, updateTable } = context;

  useEffect(() => {
    search();
  }, [formSearch]);

  // * handles
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormSearch({ ...formSearch, [name]: value });
  };

  const handleChangeSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormSearch({ ...formSearch, [name]: (value == "" ? undefined : (value == "true" ? true : false ))});
  };

  const search = () => {
    const nameCode          = formSearch.nameCode?.length           > 3 ? formSearch.nameCode           : undefined;
    const productCategoryId = formSearch.productCategoryId?.length  > 0 ? formSearch.productCategoryId  : undefined;
    const enable4Sale       = formSearch.enable4Sale;

    // if( !(nameCode || productCategoryId) ) {
    //   updateTable(TableActionEnum.LOAD, []);
    //   return;
    // }

    searchProducts(withMovements, nameCode, productTypeList, productCategoryId, enable4Sale)
    .then( (productList: ProductsProductInterface[]) => {

      const formProductList: FormProductsProductDto[] = productList.map( (value: ProductsProductInterface) => mapObjToForm(value, 0) );
      console.log(`search: formProductList=${JSON.stringify(formProductList)}`);
      updateTable(TableActionEnum.LOAD, formProductList);

    })
    .catch( (error) => {
      console.error('search: Error', error);
      updateTable(TableActionEnum.LOAD, []);
    });
    
  };

  // const initSearch = () => {
    
  //   searchProducts(withMovements, undefined, productTypeList, undefined)
  //   .then( (productList: ProductsProductInterface[]) => {

  //     const formProductList: FormProductsProductInterface[] = productList.map( (value: ProductsProductInterface) => mapObjToForm(value, 0) );
  //     console.log(`initSearch: formProductList=${JSON.stringify(formProductList)}`);
  //     updateTable(TableActionEnum.LOAD, formProductList);

  //   })
  //   .catch( (error) => {
  //     console.error('initSearch: Error', error);
  //     updateTable(TableActionEnum.LOAD, []);
  //   });
    
  // };

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

        <div className="col-6 flex-wrap">
          <label className="form-label text-end">Disponible para ventas:</label>
          <select
            name="enable4Sale"
            className="form-select"
            defaultValue="true"
            onChange={handleChangeSelect}
          >
            <option value="">Todos</option>
            <option value="true">Si</option>
            <option value="false">No</option>
          </select>
        </div>

      </div>
    </div>
  );
};
