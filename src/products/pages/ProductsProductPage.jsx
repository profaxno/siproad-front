import { useState, useEffect, useContext } from 'react'

import { FaBars } from "react-icons/fa"; 

import { ButtonWithConfirm } from '../../common/components/ButtonWithConfirm';
import { TableActionEnum } from '../../common/enums/table-actions.enum';
import { Message } from '../../common/components/Message';

import { ProductsProductContext } from '../context/ProductsProductContext';
import { ProductsElementProvider } from '../context/ProductsElementProvider';

import { ProductsProductSearch } from '../components/product/ProductsProductSearch';
import { ProductsProductTable } from '../components/product/ProductsProductTable';

import { ProductsProductForm } from '../components/product/ProductsProductForm';
import { ProductsProductElementSearch } from '../components/product/ProductsProductElementSearch';
import { ProductsProductElementTable } from '../components/product/ProductsProductElementTable';

export const ProductsProductPage = () => {

  // * hooks
  const { obj, objList, updateTable, updateForm, updateTableProductElement, cleanForm, saveProduct, deleteProduct, errors, setErrors, showMessage, setShowMessage } = useContext(ProductsProductContext);
  const [isOpenSearchSection, setIsOpenSearchSection] = useState(true);
  const [isOpenProductSection, setIsOpenProductSection] = useState(true);
  
  // console.log(`rendered... obj=${JSON.stringify(obj)}`);
  
  // * handles
  const validate = () => {
    let newErrors = {};
    
    if (!obj.name) newErrors.name = "Ingrese el nombre";
    if (obj.cost === "") newErrors.cost = "Ingrese el costo";
    if (obj.price === "") newErrors.price = "Ingrese el precio";
    // if (obj.elementList.length === 0) newErrors.elementList = "Ingrese al menos un elemento al producto";

    setErrors(newErrors);
    
    return Object.keys(newErrors).length === 0; // Devuelve true si no hay errores
  }

  const saveForm = async() => {
    if (!validate()) return;
    
    // * save
    const mutatedObj = await saveProduct(obj);
    
    // * update view
    const found = objList.find((value) => value.id === obj.id) 
    const actionType = found ? TableActionEnum.UPDATE : TableActionEnum.ADD;
    const elementListAux = obj.elementList.reduce((acc, value) => {
      if(value.active)
        acc.push({id  : value.id, name: value.name, unit: value.unit, cost: parseFloat(value.cost), qty : parseFloat(value.qty)});
      return acc;
    }, []);

    const objAux = {
      ...obj, 
      id: mutatedObj.id, 
      elementList: elementListAux
    }

    cleanForm();
    updateTable(objAux, actionType);
    setShowMessage(true);
    setIsOpenProductSection(true);
  }

  const deleteForm = async() => {
        
    await deleteProduct(obj);
    
    // * update view
    const elementListAux = obj.elementList.reduce((acc, value) => {
      if(value.active)
        acc.push({id  : value.id, name: value.name, unit: value.unit, cost: parseFloat(value.cost), qty : parseFloat(value.qty)});
      return acc;
    }, []);

    const objAux = {
      ...obj, 
      elementList: elementListAux, 
      active: false
    }

    cleanForm();
    updateTable(objAux, TableActionEnum.DELETE);
    setShowMessage(true);
    setIsOpenProductSection(true);
  }

  // * return component
  return (
     <div className="row mt-3">
            
      <div className="col-sm-6 mb-3">
        
        {/* search */}
        <div className="border rounded p-3" style={{ maxHeight: '750px'}}>
          
          <div className="d-flex align-items-center gap-2">
            <span className="d-block d-md-none fs-2" onClick={() => setIsOpenSearchSection(!isOpenSearchSection)} style={{ cursor: "pointer" }}>
              <FaBars className="text-dark"/>
            </span>

            <h4 className="text-dark m-0">Búsqueda de Productos</h4>  
          </div>

          {isOpenSearchSection && (
          <div className="border rounded mt-3 p-3">
            <ProductsProductSearch/>
            
            <div className="mt-3 overflow-auto" style={{ maxHeight: '550px'}}>
              <ProductsProductTable/>
            </div>
          </div>
          )}
        </div>
        
      </div>

      
      <div className="col-sm-6">

        <div className="border rounded p-3" style={{ maxHeight: '750px'}}>

          {/* form */}
          <div className="overflow-auto" style={{ height: '650px'}}>

            {/* product*/}
            <div className="d-flex align-items-center gap-2">

              <div className="col-10 col-sm d-flex align-items-center gap-2">
                <span className="fs-4" onClick={() => setIsOpenProductSection(!isOpenProductSection)} style={{ cursor: "pointer" }}>
                  <FaBars className="text-dark"/>
                </span>

                <h5 className="text-dark m-0">Producto</h5>
              </div>

              
              <div className="col-1 col-sm d-flex justify-content-end">
                { obj.active && obj.id &&
                  <ButtonWithConfirm className={"custom-btn-outline-danger-delete"} title={"Confirmación"} message={"Eliminar el Ordero ¿Desea Continuar?"} tooltip={"Eliminar Registro"} onExecute={deleteForm}/>
                }
              </div>
            
            </div>
            
            {isOpenProductSection && (<ProductsProductForm/>)}

            {/* product-elements*/}
            <div className="mt-4">
              <h5 className="text-dark m-0">Elementos del Producto</h5>  
            </div>

            <div className="border rounded mt-2">
                 
              <div className="p-3">
                <ProductsElementProvider>
                  <ProductsProductElementSearch/>
                </ProductsElementProvider>
                
                <div className="mt-3 overflow-auto" style={{ maxHeight: '400px'}}>
                  <ProductsProductElementTable/>
                  {/* {errors.elementList && <div className="custom-invalid-feedback border rounded p-1">{errors.elementList}</div>} */}
                </div>
              </div>

            </div>
          </div>

          {/* principal buttons */}
          <div className="d-flex mt-4 gap-1">
            <ButtonWithConfirm className={"custom-btn-outline-danger w-100"} actionName={"Nuevo"} title={"Confirmación"} message={"Se perderán los datos no guardados ¿Desea Continuar?"} onExecute={cleanForm} />
            
              { obj.active && 
                <ButtonWithConfirm className={"custom-btn-success w-100"} actionName={"Guardar"} title={"Confirmación"} message={"Guardar el Ordero ¿Desea Continuar?"} onExecute={saveForm} />
              }
          </div>

        </div>
        
      </div>

      <Message show={showMessage} onUpdateShowMessage={setShowMessage}/>
    </div>
  )
}
