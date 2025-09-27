import { useContext } from 'react'

import { ButtonWithConfirm } from '../../../common/components';

import { purchasesOrderContext } from '../context/purchases-order.context';
// import { PurchasesOrderButtonGeneratePdfPrice } from './PurchasesOrderButtonGeneratePdfPrice';
import { PurchasesOrderStatusEnum, PurchasesActionEnum } from "../enums";

export const PurchasesOrderButtons = () => {
// export const PurchasesOrderButtons = () => {

  const context = useContext(purchasesOrderContext);
  if (!context) 
    throw new Error("PurchasesOrderPage: purchasesOrderContext must be used within an PurchasesOrderProvider");

  const { actionList, isOpenFormSection, setIsOpenFormSection, saveForm, saveFormStatus, deleteForm, cleanForm } = context;
  

  return (
    <>
      {!isOpenFormSection && (
        <div>
          <button className="custom-btn-outline-success-new" title="Nuevo Registro" onClick={() => { cleanForm(); setIsOpenFormSection(true) }}/>
        </div>
      )}

      {isOpenFormSection && (
        <>

          {actionList.includes(PurchasesActionEnum.RETURN) && (
            <div>
              <button className="custom-btn-outline-success-return" title="Regresar" onClick={() => { setIsOpenFormSection(false) }}/>
            </div>
          )}

          {actionList.includes(PurchasesActionEnum.RETURN_WITH_CONFIRM) && (
            <ButtonWithConfirm
              className="custom-btn-outline-success-return"
              tooltip="Regresar"
              title="Confirmación"
              message="Se perderán los datos no guardados ¿Desea Continuar?"
              onExecute={() => setIsOpenFormSection(false)}
            />
          )}

          <ButtonWithConfirm
            className="custom-btn-outline-success-new"
            tooltip="Nuevo Registro"
            title="Confirmación"
            message="Se perderán los datos no guardados ¿Desea Continuar?"
            onExecute={cleanForm}
          />

          
          {actionList.includes(PurchasesActionEnum.SAVE) && (
            <ButtonWithConfirm
              className="custom-btn-outline-success-save"
              tooltip="Guardar Registro"
              title="Confirmación"
              message="Guardar ¿Desea Continuar?"
              onExecute={saveForm}
            />
          )}

          {actionList.includes(PurchasesActionEnum.ORDER) && (
            <ButtonWithConfirm
              className="custom-btn-outline-success"
              tooltip="Generar Orden de Venta"
              actionName="C. Orden"
              title="Confirmación"
              message="Se creará la orden de venta ¿Desea Continuar?"
              onExecute={ () => saveFormStatus(PurchasesOrderStatusEnum.ORDER) }
            />
          )}

          {/* {actionList.includes(PurchasesActionEnum.GENERATE_PDF) && (
            <PurchasesOrderButtonGeneratePdfPrice
              className="custom-btn-outline-success-print"
              tooltip="Generar PDF"
            />
          )} */}

          {actionList.includes(PurchasesActionEnum.DELETE) && (
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
