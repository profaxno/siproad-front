import type { FC } from "react";
import { useContext } from 'react'
import { SalesOrderContext } from '../context';
import { ButtonWithConfirm } from '../../../common/components';
import { ActionEnum } from '../../../common/enums/action.enum';
import { SalesOrderButtonGeneratePdfPrice } from './SalesOrderButtonGeneratePdfPrice';
import { SalesOrderStatusEnum } from "../enums";


interface Props {
  actionList: ActionEnum[];
}

export const SalesOrderButtons: FC<Props> = ({
  actionList
}) => {
// export const SalesOrderButtons = () => {

  const context = useContext(SalesOrderContext);
  if (!context) 
    throw new Error("SalesOrderPage: SalesOrderContext must be used within an SalesOrderProvider");

  const { isOpenOrderSection, setIsOpenOrderSection, saveForm, saveFormStatus, deleteForm, cleanForm } = context;
  

  return (
    <>
      {!isOpenOrderSection && (
        <div>
          <button className="custom-btn-outline-success-new" title="Nuevo Registro" onClick={() => { cleanForm(); setIsOpenOrderSection(true) }}/>
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

          {actionList.includes(ActionEnum.SAVE) && (
            <ButtonWithConfirm
              className="custom-btn-outline-success-save"
              tooltip="Guardar Registro"
              title="Confirmación"
              message="Guardar ¿Desea Continuar?"
              onExecute={saveForm}
            />
          )}

          {actionList.includes(ActionEnum.QUOTATION) && (
            <ButtonWithConfirm
              className="custom-btn-outline-success"
              tooltip="Generar Cotización"
              actionName="Crear Cotización"
              title="Confirmación"
              message="Se creará la cotización ¿Desea Continuar?"
              onExecute={ () => saveFormStatus(SalesOrderStatusEnum.QUOTATION) }
            />
          )}

          {actionList.includes(ActionEnum.ORDER) && (
            <ButtonWithConfirm
              className="custom-btn-outline-success"
              tooltip="Generar Orden de Venta"
              actionName="Crear Orden"
              title="Confirmación"
              message="Se creará la orden de venta ¿Desea Continuar?"
              onExecute={ () => saveFormStatus(SalesOrderStatusEnum.ORDER) }
            />
          )}

          {actionList.includes(ActionEnum.BILL) && (
            <div>
              <button className="custom-btn-outline-success" onClick={() => { alert('Metodo no implementado') }}>
                Facturar
              </button>
            </div>
          )}

          {actionList.includes(ActionEnum.PAY) && (
            <div>
              <button className="custom-btn-outline-success" onClick={() => { alert('Metodo no implementado') }}>
                Pagar
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
