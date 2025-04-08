import { useState, useContext } from 'react'

import { ProductsProductContext } from '../../../context/ProductsProductContext';
import { InputAmount } from '../../../../common/components/InputAmount';

export const ProductsProductForm = () => {

  // * hooks
  const { obj, updateForm, calculateProfitMargin, errors, setErrors } = useContext(ProductsProductContext);
  
  // * handles
  const handleChange = (e) => {
    updateForm({ ...obj, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  }

  return (
    <div className="border rounded mt-2 p-3">
    
      {/* name, code */}
      <div className="d-flex gap-4">
      
        <div className="col-7 flex-wrap">
        <label className="form-label">Nombre:</label>

          <input
            name="name"
            className={`form-control text-capitalize ${errors.name ? "is-invalid" : ""}`}
            type="text"
            value={obj.name?.toLowerCase()}
            onChange={handleChange}
          />
          {errors.name && <div className="custom-invalid-feedback">{errors.name}</div>}
        </div>

        <div className="col-4 flex-wrap">
          <label className="form-label text-end">Código:</label>

          <input
            name="code"
            className={"form-control"}
            type="text"
            value={obj.code}
            onChange={handleChange}
          />
        </div>

      </div>

      {/* description */}
      <div className="mt-3">
        <label className="form-label">Descripción:</label>
        <textarea
          name="description"
          className="form-control form-control-sm"
          value={obj.description?.toLowerCase()}
          onChange={handleChange}
        />
      </div>

      {/* cost, price */}
      <div className="mt-3 d-flex gap-4">
      
        <div className="col-4 flex-wrap">
          <label className="form-label">Costo:</label>

          <InputAmount 
            name={"cost"}
            className={`form-control form-control-sm ${errors.cost ? "is-invalid" : ""}`}
            value={obj.cost}
            onChange={handleChange}
            // placeholder={"Cantidad"}
          />
          {errors.cost && <div className="custom-invalid-feedback">{errors.cost}</div>}
        </div>

        <div className="col-4 flex-wrap">
          <label className="form-label text-end">Precio:</label>

          <InputAmount 
            name={"price"}
            className={`form-control form-control-sm ${errors.price ? "is-invalid" : ""}`}
            value={obj.price}
            onChange={handleChange}
            // placeholder={"Cantidad"}
          />
          {errors.price && <div className="custom-invalid-feedback">{errors.price}</div>}
        </div>

        <div className="col-3 flex-wrap">
          <label className="form-label text-end">Margen:</label>

          <div className="d-flex align-items-center gap-1">
            <InputAmount 
              name={"margin"}
              className={`form-control form-control-sm`}
              value={calculateProfitMargin(obj)}
              readOnly={true} 
            /> 
            %
          </div>
        </div>
      </div>
      
    </div>
  )
}
