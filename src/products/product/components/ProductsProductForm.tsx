import type { FC } from 'react';
import { ChangeEvent, useContext } from 'react';

import { InputAmount } from '../../../common/components';
import { ProductsProductContext } from '../context/ProductsProductContext';

export const ProductsProductForm: FC = () => {

  // * hooks
  const context = useContext(ProductsProductContext);
  if (!context) 
    throw new Error("ProductsProductForm: ProductsProductContext must be used within an ProductsProductProvider");

  const { form, formError, updateForm, setFormError, calculateProfitMargin } = context;

  // * handles
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateForm({ ...form, [e.target.name]: e.target.value });
    setFormError({ ...formError, [e.target.name]: "" });
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
            readOnly={form.readonly}
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
            readOnly={form.readonly}
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
          readOnly={form.readonly}
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
            readOnly={form.readonly}
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
            readOnly={form.readonly}
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
    </div>
  );
};