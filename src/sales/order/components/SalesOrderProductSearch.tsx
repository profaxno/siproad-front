import type { FC } from "react";
import { useState, useContext, ChangeEvent } from 'react';

import { v4 as uuidv4 } from 'uuid';

import { InputAmount, InputSearchWithTag } from '../../../common/components';
import { TableActionEnum } from '../../../common/enums';

import { salesOrderContext } from '../context/sales-order.context';
import { SalesProductDto, FormSalesOrderProductDto } from "../dto";
import { SalesOrderProductStatusEnum } from '../enums';

import { productsProductContext } from "../../../products/product/context/products-product.context";
import { ProductsProductInterface } from "../../../products/product/interfaces";

interface ErrorState {
  [key: string]: string;
}

// const initOrderProduct: FormSalesOrderProductDto = new FormSalesOrderProductDto('', '', 1, '', 0, 0, 0, 0, SalesOrderProductStatusEnum.IN_USE);

const initOrderProduct: FormSalesOrderProductDto = {
  key     : '',
  id      : '',
  name    : '',
  code    : '',
  qty     : 1,
  cost    : 0,
  price   : 0,
  discountPct: 0,
  subTotal: 0,
  status  : SalesOrderProductStatusEnum.IN_USE
}

export const SalesOrderProductSearch: FC = () => {
  
  // * hooks
  const context = useContext(salesOrderContext);
  if (!context) 
    throw new Error("SalesOrderProductSearch: salesOrderContext must be used within an SalesOrderProvider");

  const { updateTableOrderProduct } = context;

  const productContext = useContext(productsProductContext);
  if (!productContext) 
    throw new Error("SalesOrderProductSearch: productsProductContext must be used within an ProductsProductProvider");

  const { searchProducts } = productContext;
  
  const [formOrderProductSearch, setFormOrderProductSearch] = useState<FormSalesOrderProductDto>(initOrderProduct);
  const [errors, setErrors] = useState<ErrorState>({});
  // const [clean, setClean] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const valueAux = name === 'qty' ? Number(value) : value;
    setFormOrderProductSearch({ ...formOrderProductSearch, [name]: valueAux });
    setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    const newErrors: ErrorState = {};
    if (!(formOrderProductSearch?.id && formOrderProductSearch.name)) newErrors.name = 'Ingrese el nombre del producto a buscar';
    if (!formOrderProductSearch?.qty) newErrors.qty = 'Ingrese la cantidad';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateForm = (product: SalesProductDto) => { // TODO: TAL VEZ DEBA CAMBIAR EL NOMBRE DE ESTE METODO
    const subTotal = formOrderProductSearch.qty * (product.price ?? 0);
    const formOrderProduct: FormSalesOrderProductDto = new FormSalesOrderProductDto(uuidv4(), product.id ?? 'error', formOrderProductSearch.qty, product.name, product.cost ?? 0, product.price ?? 0, 0, subTotal, SalesOrderProductStatusEnum.IN_USE, undefined, product.code);
    setFormOrderProductSearch(formOrderProduct);
  };

  const search = (value: string): Promise<SalesProductDto[]> => {
    const nameCode = value?.length > 3 ? value : undefined;

    if (!nameCode) {
      return Promise.resolve([]);
    }

    return searchProducts(false, nameCode, undefined, undefined, true)
    .then( (productList: ProductsProductInterface[]) => productList.map(value => new SalesProductDto(value.name, value.code, value.description, value.cost, value.price, value.id, value.companyId) ) )
    .catch( (error: any) => {
      console.error('search: Error', error);
      return [];
    });
  };

  const handleButtonAdd = () => {
    
    if (!validate()) return;
    if (formOrderProductSearch.name === '') return;
    if (formOrderProductSearch.qty < 0) return;

    // const orderProductAux: FormSalesOrderProductInterface = {
    //   ...formOrderProductSearch,
    //   subTotal: formOrderProductSearch.qty * formOrderProductSearch.price,
    // };

    updateTableOrderProduct(TableActionEnum.ADD, formOrderProductSearch);
    setFormOrderProductSearch(initOrderProduct);
  };

  const cleanInput = () => setFormOrderProductSearch(initOrderProduct);

  return (
    <div className="d-flex gap-2">
      <div className="col-6">
        <InputSearchWithTag
          name="name"
          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
          fieldToShow={['code', 'name']}
          value={formOrderProductSearch.name}
          placeholder="Buscador..."
          onNotifyChange={handleChange}
          onSearch={search}
          onNotifyChangeSelection={updateForm}
          onNotifyRemoveTag={cleanInput}
          readOnly={false}
        />
        {errors.name && <div className="custom-invalid-feedback">{errors.name}</div>}
      </div>

      <div className="col-4">
        <InputAmount
          name="qty"
          className={`form-control ${errors.qty ? 'is-invalid' : ''}`}
          value={formOrderProductSearch.qty}
          onChange={handleChange}
          placeholder="Cantidad"
        />
        {errors.qty && <div className="custom-invalid-feedback">{errors.qty}</div>}
      </div>

      <div className="col-1 col-sm">
        <button
          name="btnAddOrderProduct"
          className="custom-btn-outline-success-add"
          onClick={handleButtonAdd}
        />
      </div>
    </div>
  );
};
