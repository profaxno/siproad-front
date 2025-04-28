import type { FC } from "react";
import { useState, useContext, ChangeEvent } from 'react';

import { v4 as uuidv4 } from 'uuid';

import { InputAmount, InputSearchWithTag } from '../../../common/components';
import { TableActionEnum, ActiveStatusEnum } from '../../../common/enums';

import { ProductsProductContext } from "../context/ProductsProductContext";

import { FormProductsProductElementInterface } from '../interfaces';
import { ProductsElementUnitEnum } from "../../element/enums/products-element-unit.enum";

import { ProductsElementInterface } from "../../element/interfaces/products-element.interface";

import { ProductsElementContext } from "../../element/context/ProductsElementContext";

interface ErrorState {
  [key: string]: string;
}

const initProductElement: FormProductsProductElementInterface = {
  key     : '',
  id      : '',
  qty     : 1,
  name    : '',
  cost    : 0,
  unit    : ProductsElementUnitEnum.UN,
  status  : ActiveStatusEnum.ACTIVE
}

export const ProductsProductElementSearch: FC = () => {
  
  // * hooks
  const context = useContext(ProductsProductContext);
  if (!context) 
    throw new Error("ProductsProductElementSearch: ProductsProductContext must be used within an ProductsProductProvider");

  const { updateTableProductElement } = context;

  const productContext = useContext(ProductsElementContext);
  if (!productContext) 
    throw new Error("ProductsProductElementSearch: ProductsElementContext must be used within an ProductsElementProvider");

  const { searchElements } = productContext;
  
  const [formProductElementSearch, setFormProductElementSearch] = useState<FormProductsProductElementInterface>(initProductElement);
  const [errors, setErrors] = useState<ErrorState>({});
  // const [clean, setClean] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const valueAux = name === 'qty' ? Number(value) : value;
    setFormProductElementSearch({ ...formProductElementSearch, [name]: valueAux });
    setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    const newErrors: ErrorState = {};
    if (!(formProductElementSearch?.id && formProductElementSearch.name)) newErrors.name = 'Ingrese el nombre del producto a buscar';
    if (!formProductElementSearch?.qty) newErrors.qty = 'Ingrese la cantidad';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateForm = (product: ProductsElementInterface) => {

    const formProductElement: FormProductsProductElementInterface ={
      key     : uuidv4(),
      id      : product.id,
      qty     : formProductElementSearch.qty,
      name    : product.name,
      cost    : product.cost,
      unit    : product.unit,
      status  : ActiveStatusEnum.ACTIVE
    };

    setFormProductElementSearch(formProductElement);
  };

  const search = (value: string): Promise<ProductsElementInterface[]> => {
    const name = value?.length > 3 ? value : undefined;

    if (!name) {
      return Promise.resolve([]);
    }

    return searchElements(name)
    .then( (productList: ProductsElementInterface[]) => productList)
    .catch( (error: any) => {
      console.error('search: Error', error);
      return [];
    });
  };

  const handleButtonAdd = () => {
    if (!validate()) return;
    if (formProductElementSearch.name === '') return;
    if (formProductElementSearch.qty < 0) return;

    // const orderElementAux: FormProductsProductElementInterface = {
    //   ...formProductElementSearch,
    //   subTotal: formProductElementSearch.qty * formProductElementSearch.price,
    // };

    updateTableProductElement(TableActionEnum.ADD, formProductElementSearch);
    setFormProductElementSearch(initProductElement);
  };

  const cleanInput = () => setFormProductElementSearch(initProductElement);

  return (
    <div className="d-flex gap-2">
      <div className="col-6">
        <InputSearchWithTag
          name="name"
          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
          // fieldToShow={['name']}
          value={formProductElementSearch.name}
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
          value={formProductElementSearch.qty}
          onChange={handleChange}
          placeholder="Cantidad"
        />
        {errors.qty && <div className="custom-invalid-feedback">{errors.qty}</div>}
      </div>

      <div className="col-1 col-sm">
        <button
          name="btnAddProductElement"
          className="custom-btn-outline-success-add"
          onClick={handleButtonAdd}
        />
      </div>
    </div>
  );
};
