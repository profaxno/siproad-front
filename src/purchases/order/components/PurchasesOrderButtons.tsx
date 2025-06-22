import type { FC } from "react";
import { useContext } from 'react'
import { PurchasesOrderContext } from '../context';
import { ButtonWithConfirm } from '../../../common/components';
import { ActionEnum } from '../../../common/enums/action.enum';
import { PurchasesOrderButtonGeneratePdfPrice } from './PurchasesOrderButtonGeneratePdfPrice';
import { PurchasesOrderStatusEnum } from "../enums";


interface Props {
  actionList: ActionEnum[];
}

export const PurchasesOrderButtons: FC<Props> = ({
  actionList
}) => {
// export const PurchasesOrderButtons = () => {

  const context = useContext(PurchasesOrderContext);
  if (!context) 
    throw new Error("PurchasesOrderPage: PurchasesOrderContext must be used within an PurchasesOrderProvider");

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

          
            <ButtonWithConfirm
              className="custom-btn-outline-success-save"
              tooltip="Guardar Registro"
              title="Confirmación"
              message="Guardar ¿Desea Continuar?"
              onExecute={saveForm}
            />

          {actionList.includes(ActionEnum.GENERATE_PDF) && (
            <PurchasesOrderButtonGeneratePdfPrice
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
