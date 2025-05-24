import type { FC } from 'react';
import { useState, useContext } from 'react';

import { ButtonWithConfirm, Message } from '../../../common/components';
import { TableActionEnum, ScreenMessageTypeEnum, ActiveStatusEnum } from '../../../common/enums';

import { InventoryProductContext } from '../context/InventoryProductContext';

import { InventoryProductSearch } from '../components/InventoryProductSearch';
import { InventoryProductSearchTable } from '../components/InventoryProductSearchTable';

import { InventoryProductForm } from '../components/InventoryProductForm';
import { InventoryProductElementSearch } from '../components/InventoryProductElementSearch';
import { InventoryProductElementTable } from '../components/InventoryProductElementTable';
import { FormInventoryProductInterface, FormInventoryProductErrorInterface, InventoryProductInterface } from '../interfaces';

import { ProductsElementProvider } from '../../element/context/ProductsElementContext';

export const InventoryProductPage: FC = () => {

  const context = useContext(InventoryProductContext);
  if (!context) 
    throw new Error("InventoryProductPage: InventoryProductContext must be used within an InventoryProductProvider");

  // * context
  const { formList, updateTable, form, saveProduct, deleteProduct, setFormError, cleanForm, screenMessage, setScreenMessage, resetScreenMessage } = context;

  const [isOpenSearchSection, setIsOpenSearchSection] = useState<boolean>(true);
  const [isOpenProductSection, setIsOpenProductSection] = useState<boolean>(true);


  // * handles
  const validate = (): boolean => {
    const newErrors: FormInventoryProductErrorInterface = {};

    if (!form.name) newErrors.name = "Ingrese el nombre del producto";
    
    setFormError(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const saveForm = () => {
    if (!validate()) return;

    saveProduct(form)
    .then( (mutatedObj: InventoryProductInterface) => {
      const found = formList.find((value) => value.id === form.id);
      const actionType = found ? TableActionEnum.UPDATE : TableActionEnum.ADD;

      const formAux: FormInventoryProductInterface = {
        ...form,
        id: mutatedObj.id
      };

      cleanForm();
      updateTable(actionType, formAux);
      setIsOpenProductSection(true);
      setScreenMessage({ type: ScreenMessageTypeEnum.SUCCESS, title: "Información", message: "Guardado Exitoso!", show: true });
    })
    .catch(() => {
      setScreenMessage({ type: ScreenMessageTypeEnum.ERROR, title: "Problema", message: 'No se completó la operación, intente de nuevo', show: true });
    });
  };

  const deleteForm = () => {
    if (!form.id)
      throw new Error("deleteForm: form.id is undefined");
    
    deleteProduct(form.id)
    .then( () => {
      const formAux: FormInventoryProductInterface = {
        ...form,
        status: ActiveStatusEnum.DELETED
      };

      cleanForm();
      updateTable(TableActionEnum.DELETE, formAux);
      setIsOpenProductSection(true);
      setScreenMessage({ type: ScreenMessageTypeEnum.SUCCESS, title: "Información", message: "Eliminación Exitosa!", show: true });
    })
    .catch(() => {
      setScreenMessage({ type: ScreenMessageTypeEnum.ERROR, title: "Problema", message: 'No se completó la operación, intente de nuevo', show: true });
    });
  }

  return (
    <div className="row mt-3">
      <div className="col-sm-6 mb-3">
        <div className="border rounded p-3" style={{ maxHeight: '750px' }}>
          <div className="d-flex align-items-center gap-2">
            
            <button
              className="d-block d-md-none custom-btn-outline-black-hamburger"
              onClick={() => setIsOpenSearchSection(!isOpenSearchSection)}
            />
            
            <h4 className="text-dark m-0">Búsqueda de Productos</h4>

          </div>

          {isOpenSearchSection && (
            <div className="mt-3">
              <InventoryProductSearch />
              <div className="mt-4 border rounded overflow-auto" style={{ maxHeight: '450px' }}>
                <InventoryProductSearchTable />
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
                  onClick={() => setIsOpenProductSection(!isOpenProductSection)}
                />

                <h5 className="text-dark m-0">Producto</h5>

              </div>

              {
                (!form.readonly && form.status == ActiveStatusEnum.ACTIVE && form.id)
                ? 
                  <div className="col-1 col-sm d-flex justify-content-end gap-2">
                    <ButtonWithConfirm
                      className="custom-btn-outline-danger-delete"
                      title="Confirmación"
                      message="Eliminar la Orden ¿Desea Continuar?"
                      tooltip="Eliminar Registro"
                      onExecute={deleteForm}
                    />
                  </div>
                : <div/>
              }
            </div>

            {isOpenProductSection && <InventoryProductForm />}

            <div className="mt-4">
              <h5 className="text-dark m-0">Elementos del Producto</h5>
            </div>

            <div className="border rounded mt-2">
              <div className="p-3">
                { 
                  (!form.readonly && form.status == ActiveStatusEnum.ACTIVE)
                  ?  
                    <ProductsElementProvider>
                      <InventoryProductElementSearch />
                    </ProductsElementProvider>
                  : <div/>
                }
                
                <div className="mt-3 border rounded overflow-auto" style={{ maxHeight: '400px' }}>
                  <InventoryProductElementTable />
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
              {
                (!form.readonly && form.status == ActiveStatusEnum.ACTIVE)
                ? 
                  <ButtonWithConfirm
                    className="custom-btn-success w-100"
                    actionName="Guardar"
                    title="Confirmación"
                    message="Guardar la Orden ¿Desea Continuar?"
                    onExecute={saveForm}
                  />
                : <div/>
              }
            </div>
          </div>
        </div>
      </div>

      <Message screenMessage={screenMessage} onResetScreenMessage={resetScreenMessage} />
    </div>
  );
};
