import type { FC } from "react";
import { useState, useContext, ChangeEvent } from 'react';

import { v4 as uuidv4 } from 'uuid';

import { InputAmount, InputSearchWithTag } from '../../../common/components';
import { TableActionEnum } from '../../../common/enums/table-actions.enum';

import { SalesOrderContext, SalesProductContext } from '../context';
import { FormSalesOrderProductInterface, SalesProductInterface } from '../interfaces';
import { SalesOrderProductStatusEnum } from '../enums/sales-order-product-status.enum';

interface ErrorState {
  [key: string]: string;
}

const initOrderProduct: FormSalesOrderProductInterface = {
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
  const context = useContext(SalesOrderContext);
  if (!context) 
    throw new Error("SalesOrderProductSearch: SalesOrderContext must be used within an SalesOrderProvider");

  const { updateTableOrderProduct } = context;

  const productContext = useContext(SalesProductContext);
  if (!productContext) 
    throw new Error("SalesOrderProductSearch: SalesProductContext must be used within an SalesProductProvider");

  const { searchProducts } = productContext;
  
  const [formOrderProductSearch, setFormOrderProductSearch] = useState<FormSalesOrderProductInterface>(initOrderProduct);
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

  const updateForm = (product: SalesProductInterface) => {

    const subTotal = formOrderProductSearch.qty * product.price;
    const formOrderProduct ={
      key     : uuidv4(),
      id      : product.id,
      qty     : formOrderProductSearch.qty,
      comment : '',
      name    : product.name,
      code    : product.code,
      cost    : product.cost,
      price   : product.price,
      discountPct: 0,
      subTotal: subTotal,
      status  : SalesOrderProductStatusEnum.IN_USE
    };

    setFormOrderProductSearch(formOrderProduct);
  };

  const search = (value: string): Promise<SalesProductInterface[]> => {
    const nameCode = value?.length > 3 ? value : undefined;

    if (!nameCode) {
      return Promise.resolve([]);
    }

    return searchProducts(nameCode)
    .then( (productList: SalesProductInterface[]) => productList)
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
