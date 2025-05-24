import type { FC } from 'react';
import { useState, useContext, useEffect } from 'react';

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
import { SalesOrderStatusEnum, SalesOrderStatusNameEnum } from '../enums/sales-order-status.enum';
import { StatusBar } from '../../../common/components/statusBar';
import { ActionEnum } from '../../../common/enums/action.enum';

export const SalesOrderPage: FC = () => {

  const context = useContext(SalesOrderContext);
  if (!context) 
    throw new Error("SalesOrderPage: SalesOrderContext must be used within an SalesOrderProvider");

  const { formList, updateTable, isOpenOrderSection, form, formError, setIsOpenOrderSection, updateForm, saveOrder, setFormError, cleanForm, screenMessage, setScreenMessage, resetScreenMessage } = context;
  const [isOpenOrderFormSection, setIsOpenOrderFormSection] = useState<boolean>(true);
  const [statusList, setStatusList] = useState<string[]>([]);
  const [actionList, setActionList] = useState<ActionEnum[]>([]);

  useEffect(() => {

    switch (form.status) {
      case SalesOrderStatusEnum.NEW:
        setStatusList([SalesOrderStatusNameEnum.NEW, SalesOrderStatusNameEnum.IN_PROCESS, SalesOrderStatusNameEnum.INVOICED]);
        setActionList([ActionEnum.RETURN, ActionEnum.SAVE]);
        break;
      case SalesOrderStatusEnum.IN_PROCESS:
        setStatusList([SalesOrderStatusNameEnum.IN_PROCESS, SalesOrderStatusNameEnum.INVOICED, SalesOrderStatusNameEnum.PAID]);
        setActionList([ActionEnum.RETURN_WITH_CONFIRM, ActionEnum.SAVE, ActionEnum.PAY, ActionEnum.GENERATE_PDF, ActionEnum.DELETE]);
        break;
      case SalesOrderStatusEnum.INVOICED:
        setStatusList([SalesOrderStatusNameEnum.IN_PROCESS, SalesOrderStatusNameEnum.INVOICED, SalesOrderStatusNameEnum.PAID]);
        setActionList([ActionEnum.RETURN, ActionEnum.GENERATE_PDF, ActionEnum.DELETE]);
        break; 
      case SalesOrderStatusEnum.PAID:
        setStatusList([SalesOrderStatusNameEnum.IN_PROCESS, SalesOrderStatusNameEnum.INVOICED, SalesOrderStatusNameEnum.PAID]);
        setActionList([ActionEnum.RETURN, ActionEnum.BILL, ActionEnum.GENERATE_PDF, ActionEnum.DELETE]);
        break; 
      case SalesOrderStatusEnum.CANCELLED:
        setStatusList([SalesOrderStatusNameEnum.IN_PROCESS, SalesOrderStatusNameEnum.CANCELLED]);
        setActionList([ActionEnum.RETURN]);
        break;
      default:
        setStatusList([]);
    }

  }, [form.status])

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

    let formAux = {
      ...form, 
      status: SalesOrderStatusEnum.IN_PROCESS
    }

    saveOrder(formAux)
    .then( (mutatedObj: SalesOrderInterface) => {
      const found = formList.find((value) => value.id === form.id);
      const actionType = found ? TableActionEnum.UPDATE : TableActionEnum.ADD;

      const formMutated: FormSalesOrderInterface = {
        ...formAux,
        id: mutatedObj.id,
        code: mutatedObj.code,
        createdAt: mutatedObj.createdAt,
      };

      // cleanForm();
      updateForm(formMutated);
      updateTable(actionType, formMutated);
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
      status: SalesOrderStatusEnum.CANCELLED,
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
    <div className="mt-3">

      <div className="d-flex border-bottom p-2 gap-2">

        {!isOpenOrderSection && (
          <div>
            <button className="custom-btn-outline-success" onClick={() => { cleanForm(); setIsOpenOrderSection(true) }}>
              Nuevo
            </button>
          </div>
        )}

        {isOpenOrderSection && (
          <>

            {actionList.includes(ActionEnum.RETURN) && (
              <div>
                <button className="custom-btn-outline-success-return" title="Regresar" onClick={() => { setIsOpenOrderSection(false) }}/>
              </div>
            )}

            {actionList.includes(ActionEnum.RETURN_WITH_CONFIRM) && (
              <ButtonWithConfirm
                className="custom-btn-outline-success-return"
                title="Confirmación"
                message="Se perderán los datos no guardados ¿Desea Continuar?"
                tooltip="Regresar"
                onExecute={() => setIsOpenOrderSection(false)}
              />
            )}

            <ButtonWithConfirm
              className="custom-btn-outline-success"
              actionName="Nuevo"
              title="Confirmación"
              message="Se perderán los datos no guardados ¿Desea Continuar?"
              onExecute={cleanForm}
            />

            {actionList.includes(ActionEnum.SAVE) && (
              <ButtonWithConfirm
                className="custom-btn-outline-success"
                actionName="Guardar"
                title="Confirmación"
                message="Guardar la Orden ¿Desea Continuar?"
                onExecute={saveForm}
              />
            )}

            {actionList.includes(ActionEnum.PAY) && (
              <div>
                <button className="custom-btn-outline-success" onClick={() => { alert('Metodo no implementado') }}>
                  Pagar
                </button>
            </div>
            )}

            {actionList.includes(ActionEnum.BILL) && (
              <div>
                <button className="custom-btn-outline-success" onClick={() => { alert('Metodo no implementado') }}>
                  Facturar
                </button>
            </div>
            )}
    
            {actionList.includes(ActionEnum.GENERATE_PDF) && (
              <SalesOrderButtonGeneratePdfPrice
                className="custom-btn-outline-success-print"
                tooltip="Generar PDF"
              />
            )}
    
            {actionList.includes(ActionEnum.DELETE) && (
              <ButtonWithConfirm
                className="custom-btn-outline-danger-delete"
                title="Confirmación"
                message="Eliminar la Orden ¿Desea Continuar?"
                tooltip="Eliminar Registro"
                onExecute={deleteForm}
              />
            )}
          </>
        )}

      </div>

      {!isOpenOrderSection && (
        <div>

          <div className="p-2 mt-3">
            <h5 className="text-dark m-0">Búsqueda de Ordenes</h5>
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
              statusList={statusList}
              currentStatus={Object.values(SalesOrderStatusNameEnum)[form.status]}
            />
          </div>
         

          <div className="row mt-3">

            <div className="col-sm-5 mb-3">  

              <div className="d-flex align-items-center">
                <button className="d-block d-md-none custom-btn-outline-black-hamburger" onClick={() => setIsOpenOrderFormSection(!isOpenOrderFormSection)}/>
                <h5 className="text-dark m-0">Orden</h5>
              </div>

              {isOpenOrderFormSection && <SalesOrderForm />}

            </div>

            <div className="col-sm-7">            
              <div>
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

                  <div className="mt-3 border rounded overflow-auto" style={{ maxHeight: '280px' }}>
                    <SalesOrderProductTable />
                    {formError.productList && <div className="custom-invalid-feedback">{formError.productList}</div>}
                  </div>
                </div>

                <div className="d-flex p-3">

                  <div className="col-6"/>

                  <div className="col-6">
                    <div className="d-flex align-items-center gap-2">
                      <label className="form-label mt-2 w-50 text-end">SubTotal:</label>
                      <InputAmount className="form-control form-control-sm" value={form.subTotal} readOnly={true} />
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <label className="form-label mt-2 w-50 text-end">IVA:</label>
                      <InputAmount className="form-control form-control-sm mt-2" value={form.iva} readOnly={true} />
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <label className="form-label mt-2 w-50 text-end">Total:</label>
                      <InputAmount className="form-control form-control-sm mt-2" value={form.total} readOnly={true} />
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
