import type { FC } from "react";
import { useState, useContext, ChangeEvent } from 'react';

import { v4 as uuidv4 } from 'uuid';

import { InputAmount, InputSearchWithTag } from '../../../common/components';
import { TableActionEnum } from '../../../common/enums/table-actions.enum';

import { purchasesOrderContext } from '../context/purchases-order.context';
import { PurchasesProductDto, FormPurchasesOrderProductDto } from '../dto';
import { PurchasesOrderProductStatusEnum } from '../enums/purchases-order-product-status.enum';

import { productsProductContext } from "../../../products/product/context/products-product.context";
import { ProductsProductInterface } from "../../../products/product/interfaces";
import { ProductTypeEnum } from "../../../products/product/enums";

interface ErrorState {
  [key: string]: string;
}

const initOrderProduct: FormPurchasesOrderProductDto = {
  key     : '',
  id      : '',
  name    : '',
  code    : '',
  qty     : 1,
  cost    : 0,
  newCost : 0,
  amount  : 0,
  updateProductCost: false,
  status  : PurchasesOrderProductStatusEnum.IN_USE
}

export const PurchasesOrderProductSearch: FC = () => {
  
  // * hooks
  const context = useContext(purchasesOrderContext);
  if (!context) 
    throw new Error("PurchasesOrderProductSearch: PurchasesOrderContext must be used within an PurchasesOrderProvider");

  const { updateTableOrderProduct } = context;

  const productContext = useContext(productsProductContext);
  if (!productContext) 
    throw new Error("PurchasesOrderProductSearch: PurchasesProductContext must be used within an PurchasesProductProvider");

  const { searchProducts } = productContext;
  
  const [formOrderProductSearch, setFormOrderProductSearch] = useState<FormPurchasesOrderProductDto>(initOrderProduct);
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

  const updateForm = (product: PurchasesProductDto) => {
    const newCost = formOrderProductSearch.amount / formOrderProductSearch.qty;
    const formOrderProduct = new FormPurchasesOrderProductDto(uuidv4(), product.id, formOrderProductSearch.qty, product.name, product.cost, newCost, formOrderProductSearch.amount, false, PurchasesOrderProductStatusEnum.IN_USE, '', product.code); // TODO: el campo updateProductCost sera variable cuando se cree la pantalla que liste los productos que cambiaran su costo en base a la orden de compra
    setFormOrderProductSearch(formOrderProduct);
  };

  const search = (value: string): Promise<ProductsProductInterface[]> => {
    const nameCode = value?.length > 3 ? value : undefined;

    if (!nameCode) {
      return Promise.resolve([]);
    }

    return searchProducts(false, nameCode, [ProductTypeEnum.P], undefined, undefined)
    .then( (productList: ProductsProductInterface[]) => productList)
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
