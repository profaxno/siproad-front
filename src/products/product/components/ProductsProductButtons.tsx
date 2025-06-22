import type { FC } from "react";
import { useContext } from 'react'
import { ProductsProductContext } from '../context/ProductsProductContext';
import { ButtonWithConfirm } from '../../../common/components';
import { ActionEnum } from '../../../common/enums/action.enum';

// interface Props {
//   actionList: ActionEnum[];
// }

// export const ProductsProductButtons: FC<Props> = ({
//   actionList
// }) => {
export const ProductsProductButtons = () => {

  const context = useContext(ProductsProductContext);
  if (!context) 
    throw new Error("ProductsProductPage: ProductsProductContext must be used within an ProductsProductProvider");

  // * context
  const { actionList, saveForm, deleteForm, cleanForm } = context;

  return (
    <>
      <ButtonWithConfirm
        className="custom-btn-outline-success-new"
        tooltip="Nuevo Registro"
        title="Confirmación"
        message="Se perderán los datos no guardados ¿Desea Continuar?"
        onExecute={cleanForm}
      />
      
      { 
        actionList.includes(ActionEnum.SAVE)
        ?  
          <ButtonWithConfirm
            className="custom-btn-outline-success-save"
            tooltip="Guardar Registro"
            title="Confirmación"
            message="Guardar ¿Desea Continuar?"
            onExecute={saveForm}
          />
        : <div/>
      }
      
      { 
        actionList.includes(ActionEnum.DELETE)
        ?  
          <ButtonWithConfirm
            className="custom-btn-outline-danger-delete"
            tooltip="Eliminar Registro"
            title="Confirmación"
            message="Eliminar la Orden ¿Desea Continuar?"
            onExecute={deleteForm}
          />
        : <div/>
      }
        
    </>
  )
}
