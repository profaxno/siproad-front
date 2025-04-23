import type { FC } from 'react';
import { ChangeEvent, useContext } from 'react';

import { InputSearchWithTag } from '../../../common/components';
import { SalesOrderContext } from '../../context/SalesOrderContext';
import { SalesOrderStatusEnum } from '../../enums/sales-order-status.enum';

export const SalesOrderForm: FC = () => {

  // * hooks
  const context = useContext(SalesOrderContext);
  if (!context) 
    throw new Error("SalesOrderForm: SalesOrderContext must be used within an SalesOrderProvider");

  // * context
  const {
    // objSearch,
    // objList,
    // setObjSearch,
    // searchOrders,
    // updateTable,

    obj,
    formError,
    updateForm,
    // updateTableOrderProduct,
    // saveOrder,
    setFormError,
    // cleanForm,
    
    // screenMessage,
    // setScreenMessage,
    // resetScreenMessage,
  } = context;

  // * handles
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateForm({ ...obj, [e.target.name]: e.target.value });
    setFormError({ ...formError, [e.target.name]: "" });
  };

  return (
    <div className="border rounded mt-2 p-3">
      <div className="d-flex gap-4">
        <div className="col-7 flex-wrap">
          <label className="form-label text-end">Nombre:</label>
          <InputSearchWithTag
            name="customerName"
            className={`form-control text-capitalize ${formError.customerName ? 'is-invalid' : ''}`}
            value={obj.customerName?.toLowerCase() ?? ''}
            placeholder="Buscador..."
            fieldToShow={['customerIdDoc', 'customerName']}
            onNotifyChange={handleChange}
            onSearch={ (search):any => {
              return [];
            }}
            onNotifyChangeSelection={(obj) => {
              updateForm({ ...obj, customerName: obj.customerName?.toLowerCase() });
              setFormError({ ...formError, customerName: "" });
            }}
            readOnly={obj.status === SalesOrderStatusEnum.CANCELLED}
          />
          {formError.customerName && (
            <div className="custom-invalid-feedback">{formError.customerName}</div>
          )}
        </div>

        <div className="col-4 flex-wrap">
          <label className="form-label text-end">RUT:</label>
          <input
            type="text"
            name="customerIdDoc"
            // className={`form-control ${formError.customerIdDoc ? 'is-invalid' : ''}`}
            className={`form-control`}
            value={obj.customerIdDoc?.toUpperCase() ?? ''}
            onChange={handleChange}
            maxLength={50}
            readOnly={obj.status === SalesOrderStatusEnum.CANCELLED}
          />
        </div>
      </div>

      <div className="flex-wrap mt-3">
        <label className="form-label">Email:</label>
        <input
          type="text"
          name="customerEmail"
          className="form-control form-control-sm"
          value={obj.customerEmail?.toLowerCase() ?? ''}
          onChange={handleChange}
          maxLength={50}
          readOnly={obj.status === SalesOrderStatusEnum.CANCELLED}
        />
      </div>

      <div className="flex-wrap mt-2">
        <label className="form-label">Dirección:</label>
        <input
          type="text"
          name="customerAddress"
          className="form-control form-control-sm text-capitalize"
          value={obj.customerAddress?.toLowerCase() ?? ''}
          onChange={handleChange}
          maxLength={150}
          readOnly={obj.status === SalesOrderStatusEnum.CANCELLED}
        />
      </div>

      <div className="mt-3">
        <label className="form-label">Comentarios:</label>
        <textarea
          name="comment"
          className="form-control form-control-sm"
          value={obj.comment ?? ''}
          onChange={handleChange}
          maxLength={250}
          readOnly={obj.status === SalesOrderStatusEnum.CANCELLED}
        />
      </div>
    </div>
  );
};