import type { FC } from 'react';
import { ChangeEvent, useContext, useEffect, useState } from 'react';

import { InputAmount, InputSearchWithTag } from '../../../common/components';
import { PurchasesOrderContext } from '../context/PurchasesOrderContext';
import { PurchasesOrderStatusEnum } from '../enums/purchases-order-status.enum';
import { PurchasesTypeInterface } from '../interfaces/purchases-type.interface';
import { DocumentTypeInterface } from '../interfaces/purchases-document-type.interface';

export const PurchasesOrderForm: FC = () => {

  // * hooks
  const context = useContext(PurchasesOrderContext);
  if (!context) 
    throw new Error("PurchasesOrderForm: PurchasesOrderContext must be used within an PurchasesOrderProvider");

  const { form, formError, updateForm, setFormError, searchPurchaseTypes, searchDocumentTypes } = context;
  const [purchaseTypeList, setPurchaseTypeList] = useState<PurchasesTypeInterface[]>([]);
  const [documentTypeList, setDocumentTypeList] = useState<DocumentTypeInterface[]>([]);
  
  useEffect(() => {
    searchPurchaseTypes().then( (list) => setPurchaseTypeList(list) );
    searchDocumentTypes().then( (list) => setDocumentTypeList(list) );
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateForm({ ...form, [e.target.name]: e.target.value });
    setFormError({ ...formError, [e.target.name]: "" });
  };

  const handleChangeCmb = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    updateForm({ ...form, [e.target.name]: value });
    if (value) {
      setFormError({ ...formError, [e.target.name]: "" });
    }
  };

  return (
    <>
      <div>

        <div className="d-flex gap-4">
          <div className="col-7 flex-wrap">
            <label className="form-label text-end">Proveedor:</label>
            <InputSearchWithTag
              name="providerName"
              className={`form-control text-capitalize ${formError.providerName ? 'is-invalid' : ''}`}
              value={form.providerName?.toLowerCase() ?? ''}
              placeholder="Buscador..."
              fieldToShow={['providerIdDoc', 'providerName']}
              onNotifyChange={handleChange}
              onSearch={ (search):any => {
                console.log('onSearch', search);
                return [];
              }}
              onNotifyChangeSelection={(form) => {
                updateForm({ ...form, providerName: form.providerName?.toLowerCase() });
                setFormError({ ...formError, providerName: "" });
              }}
              readOnly={form.status === PurchasesOrderStatusEnum.CANCELLED}
            />
            {formError.providerName && (
              <div className="custom-invalid-feedback">{formError.providerName}</div>
            )}
          </div>

          <div className="col-4 flex-wrap">
            <label className="form-label text-end">RUT:</label>
            <input
              type="text"
              name="providerIdDoc"
              // className={`form-control ${formError.providerIdDoc ? 'is-invalid' : ''}`}
              className={`form-control`}
              value={form.providerIdDoc?.toUpperCase() ?? ''}
              onChange={handleChange}
              maxLength={50}
              readOnly={form.status === PurchasesOrderStatusEnum.CANCELLED}
            />
          </div>
        </div>

        <div className="flex-wrap mt-3">
          <label className="form-label">Email:</label>
          <input
            type="text"
            name="providerEmail"
            className="form-control form-control-sm"
            value={form.providerEmail?.toLowerCase() ?? ''}
            onChange={handleChange}
            maxLength={50}
            readOnly={form.status === PurchasesOrderStatusEnum.CANCELLED}
          />
        </div>

        <div className="flex-wrap mt-2">
          <label className="form-label">Dirección:</label>
          <input
            type="text"
            name="providerAddress"
            className="form-control form-control-sm text-capitalize"
            value={form.providerAddress?.toLowerCase() ?? ''}
            onChange={handleChange}
            maxLength={150}
            readOnly={form.status === PurchasesOrderStatusEnum.CANCELLED}
          />
        </div>

        {/* <div className='d-flex gap-2 mt-2'>
          <input
            type="checkbox"
            className='form-check-input'
            // checked={checked}
            // onChange={(e) => setChecked(e.target.checked)}
          />
          
          <label>
            Guardar Cliente
          </label>
        </div> */}

      </div>

      <div className="mt-5">

        <div className="mt-3">
          <label className="form-label">Monto:</label>

          <InputAmount 
            name={"amount"}
            className={`form-control ${formError.amount ? "is-invalid" : ""}`}
            // value={form.amount || 0}
            onChange={handleChange}
            // readOnly={form.readonly}
          />
          {/* {formError.amount && <div className="custom-invalid-feedback">{formError.amount}</div>} */}
        </div>

        <div className="mt-3">
          <label htmlFor="purchaseTypeId" className="form-label text-end">Tipo de Gasto:</label>

          <select
            id="purchaseTypeId"
            name="purchaseTypeId"
            className={`form-select ${formError.purchaseTypeId ? 'is-invalid' : ''}`}
            value={form.purchaseTypeId}
            onChange={handleChangeCmb}
          >
            <option value={undefined}></option>
            {purchaseTypeList.map( (item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>

          {formError.purchaseTypeId && (
            <div className="invalid-feedback d-block">{formError.purchaseTypeId}</div>
          )}

          {/* {selected && (
            <p>
              Has seleccionado:{" "}
              {data.lista.find((item) => item.id.toString() === selected)?.nombre}
            </p>
          )} */}
        </div>

        <div className="d-flex gap-4 mt-3">

          <div className="col-7 flex-wrap">
            <label htmlFor="documentTypeId" className="form-label text-end">Tipo de Documento:</label>

            <select
              id="documentTypeId"
              name="documentTypeId"
              className={`form-select`}
              value={form.documentTypeId}
              onChange={handleChangeCmb}
            >
              <option value={undefined}></option>
              {documentTypeList.map( (item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </div>

          <div className="col-4 flex-wrap">
            <label className="form-label text-end">No. Documento:</label>
            <input
              type="text"
              name="providerIdDoc"
              // className={`form-control ${formError.providerIdDoc ? 'is-invalid' : ''}`}
              className={`form-control`}
              value={form.providerIdDoc?.toUpperCase() ?? ''}
              onChange={handleChange}
              maxLength={50}
              readOnly={form.status === PurchasesOrderStatusEnum.CANCELLED}
            />
          </div>

        </div>

        <div className="mt-3">
          <label className="form-label">Comentarios:</label>
          <textarea
            name="comment"
            className="form-control"
            value={form.comment ?? ''}
            onChange={handleChange}
            maxLength={250}
            readOnly={form.status === PurchasesOrderStatusEnum.CANCELLED}
          />
        </div>

      </div>
    </>
  );
};