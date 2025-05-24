import type { FC } from 'react';
import { useState, useContext } from 'react';

import { ButtonWithConfirm, InputAmount, Message } from '../../../common/components';
import { TableActionEnum } from '../../../common/enums/table-actions.enum';
import { ScreenMessageTypeEnum } from '../../../common/enums/screen-message-type-enum';

import { SalesOrderContext, SalesProductProvider } from '../context';

import { SalesOrderSearch } from '../components/SalesOrderSearch';
import { SalesOrderSearchTable } from '../components/SalesOrderSearchTable';

import { SalesOrderForm } from '../components/SalesOrderForm';
import { SalesOrderProductSearch } from '../components/SalesOrderProductSearch';
import { SalesOrderProductTable } from '../components/SalesOrderProductTable';
import { SalesOrderButtonGeneratePdfPrice } from '../components/SalesOrderButtonGeneratePdfPrice';
import { FormSalesOrderInterface, FormSalesOrderErrorInterface, SalesOrderInterface } from '../interfaces';
import { SalesOrderStatusEnum } from '../enums/sales-order-status.enum';

export const SalesOrderPage: FC = () => {

  const context = useContext(SalesOrderContext);
  if (!context) 
    throw new Error("SalesOrderPage: SalesOrderContext must be used within an SalesOrderProvider");

  // * context
  const { formList, updateTable, form, formError, saveOrder, setFormError, cleanForm, screenMessage, setScreenMessage, resetScreenMessage } = context;

  const [isOpenSearchSection, setIsOpenSearchSection] = useState<boolean>(true);
  const [isOpenOrderSection, setIsOpenOrderSection] = useState<boolean>(true);


  // * handles
  const validate = (): boolean => {
    const newErrors: FormSalesOrderErrorInterface = {};

    if (!form.customerName) newErrors.customerName = "Ingrese el nombre del cliente";
    if (form.productList.length === 0) newErrors.productList = "Ingrese uno ó más productos a la lista";

    setFormError(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const saveForm = () => {
    if (!validate()) return;

    saveOrder(form)
    .then( (mutatedObj: SalesOrderInterface) => {
      const found = formList.find((value) => value.id === form.id);
      const actionType = found ? TableActionEnum.UPDATE : TableActionEnum.ADD;

      const formAux: FormSalesOrderInterface = {
        ...form,
        id: mutatedObj.id,
        code: mutatedObj.code,
        createdAt: mutatedObj.createdAt,
      };

      cleanForm();
      updateTable(actionType, formAux);
      setIsOpenOrderSection(true);
      setScreenMessage({ type: ScreenMessageTypeEnum.SUCCESS, title: "Información", message: "Guardado Exitoso!", show: true });
    })
    .catch(() => {
      setScreenMessage({ type: ScreenMessageTypeEnum.ERROR, title: "Problema", message: 'No se completó la operación, intente de nuevo', show: true });
    });
  };

  const deleteForm = () => {
    const formAux = {
      ...form,
      status: 0,
    };

    saveOrder(formAux)
    .then(() => {
      cleanForm();
      updateTable(TableActionEnum.DELETE, formAux);
      setIsOpenOrderSection(true);
      setScreenMessage({ type: ScreenMessageTypeEnum.SUCCESS, title: "Información", message: "Eliminación Exitosa!", show: true });
    })
    .catch(() => {
      setScreenMessage({ type: ScreenMessageTypeEnum.ERROR, title: "Problema", message: 'No se completó la operación, intente de nuevo', show: true });
    });
  };

  return (
    <div className="row mt-3">
      <div className="col-sm-6 mb-3">
        <div className="border rounded p-3" style={{ maxHeight: '750px' }}>
          <div className="d-flex align-items-center gap-2">
            
            <button
              className="d-block d-md-none custom-btn-outline-black-hamburger"
              onClick={() => setIsOpenSearchSection(!isOpenSearchSection)}
            />

            {/* <span className="d-block d-md-none fs-2" onClick={() => setIsOpenSearchSection(!isOpenSearchSection)} style={{ cursor: "pointer" }}>
              <FaBars className="text-dark" />
            </span> */}
            
            <h4 className="text-dark m-0">Búsqueda de Ordenes</h4>

          </div>

          {isOpenSearchSection && (
            <div className="mt-3">
              <SalesOrderSearch />
              <div className="mt-4 border rounded overflow-auto" style={{ maxHeight: '450px' }}>
                <SalesOrderSearchTable />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="col-sm-6">
        <div className="border rounded p-3" style={{ maxHeight: '750px' }}>
          <div className="overflow-auto" style={{ height: '650px' }}>
            <div className="d-flex align-items-center gap-2">
              <div className="col-10 col-sm d-flex align-items-center gap-2">

                <button
                  className="custom-btn-outline-black-hamburger"
                  onClick={() => setIsOpenOrderSection(!isOpenOrderSection)}
                />

                {/* <span className="fs-4" onClick={() => setIsOpenOrderSection(!isOpenOrderSection)} style={{ cursor: "pointer" }}>
                  <FaBars className="text-dark" />
                </span> */}

                <h5 className="text-dark m-0">Orden</h5>

              </div>

              {form.status !== SalesOrderStatusEnum.CANCELLED && form.id && (
                <div className="col-1 col-sm d-flex justify-content-end gap-2">
                  
                    <ButtonWithConfirm
                      className="custom-btn-outline-danger-delete"
                      title="Confirmación"
                      message="Eliminar la Orden ¿Desea Continuar?"
                      tooltip="Eliminar Registro"
                      onExecute={deleteForm}
                    />
                  
                  <SalesOrderButtonGeneratePdfPrice
                    className="custom-btn-outline-success-print"
                    tooltip="Generar Cotización"
                  />
                </div>
              )}
            </div>

            {isOpenOrderSection && <SalesOrderForm />}

            <div className="mt-4">
              <h5 className="text-dark m-0">Productos de la Orden</h5>
            </div>

            <div className="border rounded mt-2">
              <div className="p-3">
                { form.status === SalesOrderStatusEnum.CANCELLED
                  ? ( <div/> ) //<div className="alert alert-danger text-center">Orden Cancelada</div>
                  : ( 
                      <SalesProductProvider>
                        <SalesOrderProductSearch />
                      </SalesProductProvider>
                    )
                }

                <div className="mt-3 border rounded overflow-auto" style={{ maxHeight: '400px' }}>
                  <SalesOrderProductTable />
                  {formError.productList && <div className="custom-invalid-feedback">{formError.productList}</div>}
                </div>
              </div>

              <div className="d-flex p-3">
                <div className="col-5"></div>
                <div className="col-7">
                  <div className="d-flex align-items-center gap-2">
                    <label className="form-label mt-2 w-50 text-end">SubTotal:</label>
                    <InputAmount className="form-control" value={form.subTotal} readOnly={true} />
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <label className="form-label mt-2 w-50 text-end">IVA:</label>
                    <InputAmount className="form-control mt-2" value={form.iva} readOnly={true} />
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <label className="form-label mt-2 w-50 text-end">Total:</label>
                    <InputAmount className="form-control mt-2" value={form.total} readOnly={true} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row d-flex mt-4">
            <div className="col-6 col-sm">
              <ButtonWithConfirm
                className="custom-btn-outline-danger w-100"
                actionName="Nuevo"
                title="Confirmación"
                message="Se perderán los datos no guardados ¿Desea Continuar?"
                onExecute={cleanForm}
              />
            </div>

            <div className="col-6 col-sm">
              {form.status === SalesOrderStatusEnum.IN_PROGRESS && (
                <ButtonWithConfirm
                  className="custom-btn-success w-100"
                  actionName="Guardar"
                  title="Confirmación"
                  message="Guardar la Orden ¿Desea Continuar?"
                  onExecute={saveForm}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <Message screenMessage={screenMessage} onResetScreenMessage={resetScreenMessage} />
    </div>
  );
};
