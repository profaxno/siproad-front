import type { FC } from "react";
import { useState, useContext, ChangeEvent } from 'react';

import { v4 as uuidv4 } from 'uuid';

import { InputAmount, InputSearchWithTag } from '../../../common/components';
import { TableActionEnum, ActiveStatusEnum } from '../../../common/enums';

import { productsProductContext } from '../context/products-product.context';
import { FormProductsProductElementDto, FormProductsProductDto } from '../dto';
import { ProductsProductInterface } from '../interfaces';
import { ProductTypeEnum } from "../enums/product-type.enum";

interface ErrorState {
  [key: string]: string;
}

const initForm: FormProductsProductDto = {
  id          : undefined,
  name        : '',
  code        : '',
  description : '',
  unit        : undefined,
  cost        : 0,
  price       : 0,
  type        : 0,
  enable4Sale : false,
  elementList: [],
  status      : ActiveStatusEnum.ACTIVE
};

const initProductElement: FormProductsProductElementDto = {
  key     : '',
  element: initForm,
  // id      : '',
  qty     : 1,
  // name    : '',
  // cost    : 0,
  // unit    : ProductsElementUnitEnum.UN,
  status  : ActiveStatusEnum.ACTIVE
}

export const ProductsProductElementSearch: FC = () => {
  
  // * hooks
  const context = useContext(productsProductContext);
  if (!context) 
    throw new Error("ProductsProductElementSearch: productsProductContext must be used within an ProductsProductProvider");

  const { form, searchProducts, mapObjToForm, updateTableProductElement } = context;
  const [formProductElementSearch, setFormProductElementSearch] = useState<FormProductsProductElementDto>(initProductElement);
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
    if (!(formProductElementSearch?.element.id && formProductElementSearch.element.name)) newErrors.name = 'Ingrese el nombre del producto a buscar';
    if (!formProductElementSearch?.qty) newErrors.qty = 'Ingrese la cantidad';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateForm = (obj: ProductsProductInterface) => {
    const form = mapObjToForm(obj, 0);
    const formProductElement: FormProductsProductElementDto = new FormProductsProductElementDto(uuidv4(), formProductElementSearch.qty, form, ActiveStatusEnum.ACTIVE);
    setFormProductElementSearch(formProductElement);
  };

  // const updateForm = (obj: ProductsProductInterface) => {

  //   const form = mapObjToForm(obj, 0);
    
  //   const formProductElement: FormProductsProductElementDto ={
  //     key     : uuidv4(),
  //     element: form,
  //     // id      : product.id,
  //     qty     : formProductElementSearch.qty,
  //     // name    : product.name,
  //     // cost    : product.cost,
  //     // unit    : product.unit,
  //     status  : ActiveStatusEnum.ACTIVE
  //   };

  //   setFormProductElementSearch(formProductElement);
  // };

  const search = (value: string): Promise<ProductsProductInterface[]> => {
    const name = value?.length > 3 ? value : undefined;

    if (!name) {
      return Promise.resolve([]);
    }

    return searchProducts(false, name, [ProductTypeEnum.P, ProductTypeEnum.PC])
    .then( (productList: ProductsProductInterface[]) => productList.filter(value => value.id != form.id) )
    .catch( (error: any) => {
      console.error('search: Error', error);
      return [];
    });
  };

  const handleButtonAdd = () => {
    if (!validate()) return;
    if (formProductElementSearch.element.name === '') return;
    if (formProductElementSearch.qty < 0) return;
    
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
          value={formProductElementSearch.element?.name}
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
