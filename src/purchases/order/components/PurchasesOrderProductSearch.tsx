import type { FC } from "react";
import { useState, useContext, ChangeEvent } from 'react';

import { v4 as uuidv4 } from 'uuid';

import { InputAmount, InputSearchWithTag } from '../../../common/components';
import { TableActionEnum } from '../../../common/enums/table-actions.enum';

import { PurchasesOrderContext, PurchasesProductContext } from '../context';
import { FormPurchasesOrderProductInterface, PurchasesProductInterface } from '../interfaces';
import { PurchasesOrderProductStatusEnum } from '../enums/purchases-order-product-status.enum';

interface ErrorState {
  [key: string]: string;
}

const initOrderProduct: FormPurchasesOrderProductInterface = {
  key     : '',
  id      : '',
  name    : '',
  code    : '',
  qty     : 1,
  cost    : 0,
  amount  : 0,
  updateProductCost: false,
  status  : PurchasesOrderProductStatusEnum.IN_USE
}

export const PurchasesOrderProductSearch: FC = () => {
  
  // * hooks
  const context = useContext(PurchasesOrderContext);
  if (!context) 
    throw new Error("PurchasesOrderProductSearch: PurchasesOrderContext must be used within an PurchasesOrderProvider");

  const { updateTableOrderProduct } = context;

  const productContext = useContext(PurchasesProductContext);
  if (!productContext) 
    throw new Error("PurchasesOrderProductSearch: PurchasesProductContext must be used within an PurchasesProductProvider");

  const { searchProducts } = productContext;
  
  const [formOrderProductSearch, setFormOrderProductSearch] = useState<FormPurchasesOrderProductInterface>(initOrderProduct);
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
    if (!formOrderProductSearch?.amount) newErrors.amount = 'Ingrese el monto';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateForm = (product: PurchasesProductInterface) => {

    const formOrderProduct = {
      key     : uuidv4(),
      id      : product.id,
      qty     : formOrderProductSearch.qty,
      comment : '',
      name    : product.name,
      code    : product.code,
      cost    : product.cost,
      amount  : formOrderProductSearch.amount,
      updateProductCost: false, // TODO: Esta valor sera variable cuando se cree la pantalla que liste los productos que cambiaran su costo en base a la orden de compra
      status  : PurchasesOrderProductStatusEnum.IN_USE
    };

    setFormOrderProductSearch(formOrderProduct);
  };

  const search = (value: string): Promise<PurchasesProductInterface[]> => {
    const nameCode = value?.length > 3 ? value : undefined;

    if (!nameCode) {
      return Promise.resolve([]);
    }

    return searchProducts(nameCode)
    .then( (productList: PurchasesProductInterface[]) => productList)
    .catch( (error: any) => {
      console.error('search: Error', error);
      return [];
    });
  };

  const handleButtonAdd = () => {
    if (!validate()) return;
    if (formOrderProductSearch.name === '') return;
    if (formOrderProductSearch.qty < 0) return;
    if (formOrderProductSearch.amount < 0) return;

    // const orderProductAux: FormPurchasesOrderProductInterface = {
    //   ...formOrderProductSearch,
    //   subTotal: formOrderProductSearch.qty * formOrderProductSearch.price,
    // };

    updateTableOrderProduct(TableActionEnum.ADD, formOrderProductSearch);
    setFormOrderProductSearch(initOrderProduct);
  };

  const cleanInput = () => setFormOrderProductSearch(initOrderProduct);

  return (
    <div className="d-flex gap-2">
      <div className="col-5">
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

      <div className="col-2">
        <InputAmount
          name="qty"
          className={`form-control ${errors.qty ? 'is-invalid' : ''}`}
          value={formOrderProductSearch.qty}
          onChange={handleChange}
          placeholder="Cantidad"
        />
        {errors.qty && <div className="custom-invalid-feedback">{errors.qty}</div>}
      </div>

      <div className="col-3">
        <InputAmount
          name="amount"
          className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
          value={formOrderProductSearch.amount}
          onChange={handleChange}
          placeholder="Monto"
        />
        {errors.amount && <div className="custom-invalid-feedback">{errors.amount}</div>}
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
