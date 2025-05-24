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
import { StatusBar } from '../../../common/components/statusBar';

export const SalesQuotationPage: FC = () => {

  const context = useContext(SalesOrderContext);
  if (!context) 
    throw new Error("SalesQuotationPage: SalesOrderContext must be used within an SalesOrderProvider");

  const { formList, updateTable, isOpenOrderSection, form, formError, setIsOpenOrderSection, updateForm, saveOrder, setFormError, cleanForm, screenMessage, setScreenMessage, resetScreenMessage } = context;
  const [isOpenOrderFormSection, setIsOpenOrderFormSection] = useState<boolean>(true);

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

      // cleanForm();
      updateForm(formAux);
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

  const estados = ['pendiente', 'aprobada', 'rechazada'];
  const getStepClass = (estado: string) => {
    if (estado === "aprobada") return 'paso actual';
    const indexActual = estados.indexOf("aprobada");
    const index = estados.indexOf(estado);
    return index < indexActual ? 'paso completado' : 'paso pendiente';
  };

  
  return (
    <div className="mt-3">

      <div className="d-flex border-bottom p-2 gap-2">
      {/* <div className="d-flex border rounded p-2 gap-2"> */}

        {isOpenOrderSection && (
          <ButtonWithConfirm
            className="custom-btn-outline-success-return"
            title="Confirmación"
            message="Se perderán los datos no guardados ¿Desea Continuar?"
            tooltip="Regresar"
            onExecute={() => setIsOpenOrderSection(false)}
          />
        )}

        {!isOpenOrderSection && (
          <div>
            <button className="custom-btn-outline-success" onClick={() => { cleanForm(); setIsOpenOrderSection(true) }}>
              Nuevo
            </button>
          </div>
        )}

        {isOpenOrderSection && (
          <ButtonWithConfirm
            className="custom-btn-outline-success"
            actionName="Nuevo"
            title="Confirmación"
            message="Se perderán los datos no guardados ¿Desea Continuar?"
            onExecute={cleanForm}
          />
        )}

        {isOpenOrderSection && form.status === SalesOrderStatusEnum.IN_PROGRESS && (
          <ButtonWithConfirm
            className="custom-btn-outline-success"
            actionName="Guardar"
            title="Confirmación"
            message="Guardar la Orden ¿Desea Continuar?"
            onExecute={saveForm}
          />
        )}
        
        {isOpenOrderSection && form.status !== SalesOrderStatusEnum.CANCELLED && form.id && (
          <>
            <SalesOrderButtonGeneratePdfPrice
              className="custom-btn-outline-success-print"
              tooltip="Generar PDF"
            />

            <ButtonWithConfirm
              className="custom-btn-outline-danger-delete"
              title="Confirmación"
              message="Eliminar la Orden ¿Desea Continuar?"
              tooltip="Eliminar Registro"
              onExecute={deleteForm}
            />
          </>
        )}

      </div>

      {!isOpenOrderSection && (
        <div>

          <div className="p-2 mt-3">
            <h5 className="text-dark m-0">Búsqueda de Cotizaciones</h5>
          </div>

          <div className="row">
            <div className="col-sm-3 mb-3">
              <SalesOrderSearch />
            </div>

            <div className="col-sm-9 mb-3">
              <div className="border rounded overflow-auto" style={{ maxHeight: '600px' }}>
                <SalesOrderSearchTable />
              </div>
            </div>
          </div>

        </div>
      )}

      {isOpenOrderSection && (

        <div>
          
          <div className="border-bottom">
            <StatusBar
              statusList={['en progreso', 'facturada', 'pagada']}
              currentStatus="en progreso"
            />
          </div>
         

          <div className="row mt-3">

            <div className="col-sm-5 mb-3">  

              <div className="d-flex align-items-center">
                <button className="d-block d-md-none custom-btn-outline-black-hamburger" onClick={() => setIsOpenOrderFormSection(!isOpenOrderFormSection)}/>
                <h5 className="text-dark m-0">Cotización</h5>
              </div>

              {isOpenOrderFormSection && <SalesOrderForm />}

            </div>

            <div className="col-sm-7">            
              <div>
                <h5 className="text-dark m-0">Productos de la Cotización</h5>
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

          </div>

        </div>


        
      )}

      <Message screenMessage={screenMessage} onResetScreenMessage={resetScreenMessage} />
    </div>
  );
};
