import { useContext } from 'react'
import { ButtonWithConfirm } from '../../../common/components';
import { ActionEnum } from '../../../common/enums';

import { productsProductContext } from '../context/products-product.context';

// interface Props {
//   actionList: ActionEnum[];
// }

// export const ProductsProductButtons: FC<Props> = ({
//   actionList
// }) => {
export const ProductsProductButtons = () => {

  const context = useContext(productsProductContext);
  if (!context) 
    throw new Error("ProductsProductPage: productsProductContext must be used within an ProductsProductProvider");

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
