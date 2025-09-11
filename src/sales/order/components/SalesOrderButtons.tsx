import { useContext } from 'react'

import { ButtonWithConfirm } from '../../../common/components';

import { salesOrderContext } from '../context/sales-order.context';
import { SalesOrderButtonGeneratePdfPrice } from './SalesOrderButtonGeneratePdfPrice';
import { SalesOrderStatusEnum, SalesActionEnum } from "../enums";

export const SalesOrderButtons = () => {
// export const SalesOrderButtons = () => {

  const context = useContext(salesOrderContext);
  if (!context) 
    throw new Error("SalesOrderPage: salesOrderContext must be used within an SalesOrderProvider");

  const { actionList, isOpenOrderSection, setIsOpenOrderSection, saveForm, saveFormStatus, deleteForm, cleanForm } = context;
  

  return (
    <>
      {!isOpenOrderSection && (
        <div>
          <button className="custom-btn-outline-success-new" title="Nuevo Registro" onClick={() => { cleanForm(); setIsOpenOrderSection(true) }}/>
        </div>
      )}

      {isOpenOrderSection && (
        <>

          {actionList.includes(SalesActionEnum.RETURN) && (
            <div>
              <button className="custom-btn-outline-success-return" title="Regresar" onClick={() => { setIsOpenOrderSection(false) }}/>
            </div>
          )}

          {actionList.includes(SalesActionEnum.RETURN_WITH_CONFIRM) && (
            <ButtonWithConfirm
              className="custom-btn-outline-success-return"
              tooltip="Regresar"
              title="Confirmación"
              message="Se perderán los datos no guardados ¿Desea Continuar?"
              onExecute={() => setIsOpenOrderSection(false)}
            />
          )}

          <ButtonWithConfirm
            className="custom-btn-outline-success-new"
            tooltip="Nuevo Registro"
            title="Confirmación"
            message="Se perderán los datos no guardados ¿Desea Continuar?"
            onExecute={cleanForm}
          />

          {actionList.includes(SalesActionEnum.SAVE) && (
            <ButtonWithConfirm
              className="custom-btn-outline-success-save"
              tooltip="Guardar Registro"
              title="Confirmación"
              message="Guardar ¿Desea Continuar?"
              onExecute={saveForm}
            />
          )}

          {actionList.includes(SalesActionEnum.QUOTATION) && (
            <ButtonWithConfirm
              className="custom-btn-outline-success"
              tooltip="Generar Cotización"
              actionName="Cotizar"
              title="Confirmación"
              message="Se creará la cotización ¿Desea Continuar?"
              onExecute={ () => saveFormStatus(SalesOrderStatusEnum.QUOTATION) }
            />
          )}

          {actionList.includes(SalesActionEnum.ORDER) && (
            <ButtonWithConfirm
              className="custom-btn-outline-success"
              tooltip="Generar Orden de Venta"
              actionName="C. Orden"
              title="Confirmación"
              message="Se creará la orden de venta ¿Desea Continuar?"
              onExecute={ () => saveFormStatus(SalesOrderStatusEnum.ORDER) }
            />
          )}

          {actionList.includes(SalesActionEnum.BILL) && (
            <div>
              <button className="custom-btn-outline-success" onClick={() => { alert('Metodo no implementado') }}>
                Facturar
              </button>
            </div>
          )}

          {actionList.includes(SalesActionEnum.PAY) && (
            <div>
              <button className="custom-btn-outline-success" onClick={() => { alert('Metodo no implementado') }}>
                Pagar
              </button>
            </div>
          )}

          {actionList.includes(SalesActionEnum.GENERATE_PDF) && (
            <SalesOrderButtonGeneratePdfPrice
              className="custom-btn-outline-success-print"
              tooltip="Generar PDF"
            />
          )}

          {actionList.includes(SalesActionEnum.DELETE) && (
            <ButtonWithConfirm
              className="custom-btn-outline-danger-delete"
              tooltip="Eliminar Registro"
              title="Confirmación"
              message="Eliminar la Orden ¿Desea Continuar?"
              onExecute={deleteForm}
            />
          )}
        </>
      )}
    </>
  )
}
