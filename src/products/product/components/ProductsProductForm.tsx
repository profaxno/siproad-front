import type { FC } from 'react';
import { ChangeEvent, useContext, useEffect, useState } from 'react';

import { InputAmount } from '../../../common/components';
import { ActionEnum } from '../../../common/enums';

import { productsProductContext } from '../context/products-product.context';
import { ProductsProductUnitInterface } from '../interfaces';

export const ProductsProductForm: FC = () => {

  // * hooks
  const context = useContext(productsProductContext);
  if (!context) 
    throw new Error("ProductsProductForm: productsProductContext must be used within an ProductsProductProvider");

  const { actionList, form, formError, updateForm, setFormError, searchProductUnits, calculateProfitMargin } = context;
  const [productUnitList, setProductUnitList] = useState<ProductsProductUnitInterface[]>([]);

  useEffect(() => {
    searchProductUnits().then( (list) => setProductUnitList(list) );
  }, []);

  // * handles
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateForm({ ...form, [e.target.name]: e.target.value });
    setFormError({ ...formError, [e.target.name]: "" });
  };

  const handleChangeCmb = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value === '' ? undefined : e.target.value;
    updateForm({ ...form, [e.target.name]: value });
    if (value) {
      setFormError({ ...formError, [e.target.name]: "" });
    }
  };

  const handleChangeCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
    updateForm({ ...form, [e.target.name]: e.target.checked });
  };

  return (
    <div className="border rounded mt-2 p-3">
      {/* name, code */}
      <div className="d-flex gap-4">
      
        <div className="col-7 flex-wrap">
          <label className="form-label">Nombre:</label>

          <input
            type="text"
            name="name"
            className={`form-control text-capitalize ${formError.name ? "is-invalid" : ""}`}
            value={form.name?.toLowerCase() || ""}
            onChange={handleChange}
            maxLength={50}
            readOnly={!actionList.includes(ActionEnum.SAVE)}
          />
          {formError.name && <div className="custom-invalid-feedback">{formError.name}</div>}
        </div>

        <div className="col-4 flex-wrap">
          <label className="form-label text-end">Código:</label>

          <input
            type="text"
            name="code"
            className={"form-control"}
            value={form.code || ""}
            onChange={handleChange}
            maxLength={50}
            readOnly={!actionList.includes(ActionEnum.SAVE)}
          />
        </div>

      </div>

      {/* description */}
      <div className="mt-3">
        <label className="form-label">Descripción:</label>
        <textarea
          name="description"
          className="form-control form-control-sm"
          value={form.description?.toLowerCase() || ""}
          onChange={handleChange}
          maxLength={100}
          readOnly={!actionList.includes(ActionEnum.SAVE)}
        />
      </div>

      {/* cost, price */}
      <div className="mt-3 d-flex gap-3">
      
        <div className="col-4 flex-wrap">
          <label className="form-label">Costo:</label>

          <InputAmount 
            name={"cost"}
            className={`form-control form-control-sm ${formError.cost ? "is-invalid" : ""}`}
            value={form.cost || 0}
            onChange={handleChange}
            // placeholder={"Cantidad"}
            readOnly={!actionList.includes(ActionEnum.SAVE)}
          />
          {formError.cost && <div className="custom-invalid-feedback">{formError.cost}</div>}
        </div>

        <div className="col-4 flex-wrap">
          <label className="form-label text-end">Precio:</label>

          <InputAmount 
            name={"price"}
            className={`form-control form-control-sm ${formError.price ? "is-invalid" : ""}`}
            value={form.price || 0}
            onChange={handleChange}
            // placeholder={"Cantidad"}
            readOnly={!actionList.includes(ActionEnum.SAVE)}
          />
          {formError.price && <div className="custom-invalid-feedback">{formError.price}</div>}
        </div>

        <div className="col-3 flex-wrap">
          <label className="form-label text-end">Margen:</label>

          <div className="d-flex align-items-center gap-1">
            <InputAmount 
              name={"margin"}
              className={`form-control form-control-sm`}
              value={calculateProfitMargin(form)}
              readOnly={true}
            />
            %
          </div>
        </div>
        
      </div>

      <div className="d-flex gap-5 mt-3">
        <div className="col-4 flex-wrap">
          <label htmlFor="productUnitId" className="form-label text-end">Unidad:</label>

          <select
            id="productUnitId"
            name="productUnitId"
            className={`form-select form-select-sm`}
            value={form.productUnitId ?? ''}
            onChange={handleChangeCmb}
          >
            <option value={''}></option>
            {productUnitList.map( (item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>

        </div>

        <div className="col-8 d-flex gap-2 mt-4">
          <input
            type="checkbox"
            name='enable4Sale'
            className='form-check-input'
            checked={form.enable4Sale}
            onChange={handleChangeCheckbox}
            readOnly={!actionList.includes(ActionEnum.SAVE)}
          />
          
          <label>Disp. en ventas</label>
        </div>
      </div>

      {/* <div className="mt-3">
        <label htmlFor="productUnitId" className="form-label text-end">Unidad:</label>

        <select
          id="productUnitId"
          name="productUnitId"
          className={`form-select form-select-sm`}
          value={form.productUnitId}
          onChange={handleChangeCmb}
        >
          <option value={undefined}></option>
          {productUnitList.map( (item) => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </select>
      </div>

      <div className='d-flex gap-2 mt-3'>
        <input
          type="checkbox"
          name='enable4Sale'
          className='form-check-input'
          checked={form.enable4Sale}
          onChange={handleChangeCheckbox}
          readOnly={!actionList.includes(ActionEnum.SAVE)}
        />
        
        <label>Disponible para ventas</label>
      </div> */}

    </div>
  );
};