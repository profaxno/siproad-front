import { useState, useContext } from 'react'

import { SalesOrderContext } from '../../context/SalesOrderContext';
import { InputAmount } from '../../../common/components/InputAmount';
import { InputSearchWithTag } from '../../../common/components';

export const SalesOrderForm = () => {

  // * hooks
  const { obj, updateForm, errors, setErrors } = useContext(SalesOrderContext);
  
  // * handles
  const handleChange = (e) => {
    updateForm({ ...obj, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  }

  return (
    <div className="border rounded mt-2 p-3">
      <div className="d-flex gap-4">

        <div className="col-7 flex-wrap">
          <label className="form-label text-end">Cliente:</label>

          <InputSearchWithTag
            name="customerName"
            className={`form-control text-capitalize ${errors.customerName ? "is-invalid" : ""}`}
            searchField={"name"}
            value={obj.customerName?.toLowerCase()} // ! Esto hace que se renderice 2 veces la pantalla
            placeholder={"Buscador..."}
            onNotifyChangeEvent={handleChange}
            // onSearchOptions={onSearchCustomerList}
            // onNotifySelectOption={updateSelectCustomer}
            // onNotifyRemoveTag={cleanCustomer}
            // switchRestart={switchRestart}
          />
          {errors.customerName && <div className="custom-invalid-feedback">{errors.customerName}</div>}
        </div>

        <div className="col-4 flex-wrap">
          <label className="form-label text-end">RUT:</label>

          <input
            type="text"
            name="customerIdDoc"
            className={`form-control ${errors.customerIdDoc ? "is-invalid" : ""}`}
            value={obj.customerIdDoc?.toUpperCase()}
            onChange={handleChange}
          />
        </div>

      </div>

      <div className="flex-wrap mt-3 ">
        <label className="form-label">Email:</label>

        <input
          type="text"
          name="customerEmail"
          className={"form-control form-control-sm"}
          value={obj.customerEmail?.toLowerCase()}
          onChange={handleChange}
        />
      </div>

      <div className="flex-wrap mt-2">
        <label className="form-label">Dirección:</label>

        <input
          type="text"
          name="customerAddress"
          className="form-control form-control-sm text-capitalize"
          value={obj.customerAddress?.toLowerCase()}
          onChange={handleChange}
        />
      </div>

      <div className="mt-3">
        <label className="form-label">Comentarios:</label>
        <textarea
          name="comment"
          className="form-control form-control-sm"
          value={obj.comment?.toLowerCase()}
          onChange={handleChange}
        />
      </div>
    </div>
  )
}
