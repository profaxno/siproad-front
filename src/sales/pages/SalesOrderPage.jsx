import { useState, useEffect, useContext } from 'react'

import { FaBars } from "react-icons/fa"; 

import { ButtonWithConfirm, InputAmount, Message } from '../../common/components';
import { TableActionEnum } from '../../common/enums/table-actions.enum';

import { SalesOrderContext, SalesProductProvider } from '../context';

import { SalesOrderSearch } from '../components/orders/SalesOrderSearch';
import { SalesOrderSearchTable } from '../components/orders/SalesOrderSearchTable';

import { SalesOrderForm } from '../components/orders/SalesOrderForm';
import { SalesOrderProductSearch } from '../components/orders/SalesOrderProductSearch';
import { SalesOrderProductTable } from '../components/orders/SalesOrderProductTable';
import { SalesOrderButtonGeneratePdfPrice } from '../components/orders/SalesOrderButtonGeneratePdfPrice';

export const SalesOrderPage = () => {

  // * hooks
  const { obj, objList, updateTable, cleanForm, saveOrder, errors, setErrors, screenMessage, setScreenMessage, resetScreenMessage } = useContext(SalesOrderContext);
  const [isOpenSearchSection, setIsOpenSearchSection] = useState(true);
  const [isOpenOrderSection, setIsOpenOrderSection] = useState(true);
  
  // console.log(`rendered...`);
  
  // * handles
  const validate = () => {
    let newErrors = {};

    if (!obj.customerName) newErrors.customerName = "Ingrese el nombre del cliente";
    if (obj.productList.length === 0) newErrors.productList = "Ingrese uno ó mas productos a la lista";

    setErrors(newErrors);
    
    return Object.keys(newErrors).length === 0; // Devuelve true si no hay errores
  }

  const saveForm = () => {
    if (!validate()) 
      return;
    
    saveOrder(obj)
    .then( (mutatedObj) => {
      
      const found = objList.find((value) => value.id === obj.id) 
      const actionType = found ? TableActionEnum.UPDATE : TableActionEnum.ADD;
      
      const objAux = {
        ...obj,
        id: mutatedObj.id,
        code: mutatedObj.code,
        createdAt: mutatedObj.createdAt,
      }

      cleanForm();
      updateTable(objAux, actionType);
      setIsOpenOrderSection(true);
      setScreenMessage({type: "success", title: "Información", message: "Guardado Exitoso!", show: true});

    })
    .catch((error) => {
      setScreenMessage({type: "error", title: "Problema", message: 'No se completó la operación, intente de nuevo', show: true});
    });

    // // * save
    // const mutatedObj = await saveOrder(obj);
    // alert(`mutatedObj: ${JSON.stringify(mutatedObj)}`);
    
    // // * update view
    // const found = objList.find((value) => value.id === obj.id) 
    // const actionType = found ? TableActionEnum.UPDATE : TableActionEnum.ADD;
    
    // const objAux = {
    //   ...obj,
    //   id: mutatedObj.id,
    //   code: mutatedObj.code,
    //   createdAt: mutatedObj.createdAt,
    // }

    // cleanForm();
    // updateTable(objAux, actionType);
    // // setShowMessage(true);
    // setScreenMessage({type: "success", title: "Información", message: "Operación Exitosa", show: true});
    // setIsOpenOrderSection(true);
  }

  const deleteForm = () => {
     
    const objAux = {
      ...obj,
      status: 0,
    }

    saveOrder(objAux)
    .then( (mutatedObj) => {
      
      cleanForm();
      updateTable(objAux, TableActionEnum.DELETE);
      setIsOpenOrderSection(true);
      setScreenMessage({type: "success", title: "Información", message: "Eliminación Exitosa!", show: true});

    })
    .catch((error) => {
      setScreenMessage({type: "error", title: "Problema", message: 'No se completó la operación, intente de nuevo', show: true});
    });

    // // * save
    // await saveOrder(objAux);

    // // * update view
    // cleanForm();
    // updateTable(objAux, TableActionEnum.DELETE);
    // setScreenMessage({type: "success", title: "Información", message: "Operación Exitosa", show: true});
    // // setShowMessage(true);
    // setIsOpenOrderSection(true);
  }

    
  // const deleteForm = async() => {
     
  //   // * delete
  //   await deleteOrder(obj);

  //   // * update view
  //   const objAux = {
  //     ...obj,
  //     status: 0,
  //   }

  //   cleanForm();
  //   updateTable(objAux, TableActionEnum.DELETE);
  //   setShowMessage(true);
  //   setIsOpenOrderSection(true);
  // }

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

            <h4 className="text-dark m-0">Búsqueda de Ordenes</h4>  
          </div>

          {isOpenSearchSection && (
          <div className="mt-3">
            <SalesOrderSearch/>
            
            <div className="mt-4 border rounded overflow-auto" style={{ maxHeight: '450px'}}>
              <SalesOrderSearchTable/>
            </div>
          </div>
          )}
        </div>
        
      </div>

      
      <div className="col-sm-6">

        <div className="border rounded p-3" style={{ maxHeight: '750px'}}>

          {/* form */}
          <div className="overflow-auto" style={{ height: '650px'}}>

            {/* order*/}
            <div className="d-flex align-items-center gap-2">

              <div className="col-10 col-sm d-flex align-items-center gap-2">
                <span className="fs-4" onClick={() => setIsOpenOrderSection(!isOpenOrderSection)} style={{ cursor: "pointer" }}>
                  <FaBars className="text-dark"/>
                </span>

                <h5 className="text-dark m-0">Orden</h5>
              </div>

              
              <div className="col-1 col-sm d-flex justify-content-end gap-1">
                { obj.status != 0 && obj.id &&
                  // <ButtonWithConfirm className={"btn btn-outline-danger"} title={"Confirmación"} message={"Eliminar el Ordero ¿Desea Continuar?"} tooltip={"Eliminar Registro"} onExecute={deleteForm} imgPath={'/assets/delete-red.png'} imgStyle={{ width: "20px", height: "20px" }}/>
                  <ButtonWithConfirm className={"custom-btn-outline-danger-delete"} title={"Confirmación"} message={"Eliminar la Orden ¿Desea Continuar?"} tooltip={"Eliminar Registro"} onExecute={deleteForm}/>
                }
                {/* <SalesOrderButtonGeneratePdfPrice className={"btn btn-outline-success"} onConfirm={validate} orderData={obj} tooltip={"Generar Cotización"} imgPath={'/assets/printer-green.png'} imgStyle={{ width: "20px", height: "20px" }}/> */}
                <SalesOrderButtonGeneratePdfPrice className={"custom-btn-outline-success-print"} onConfirm={validate} orderData={obj} tooltip={"Generar Cotización"}/>
              </div>
            
            </div>
            
            {isOpenOrderSection && (<SalesOrderForm/>)}

            {/* order-products*/}
            <div className="mt-4">
              <h5 className="text-dark m-0">Productos de la Orden</h5>  
            </div>

            <div className="border rounded mt-2">
                 
              <div className="p-3">
                <SalesProductProvider>
                  <SalesOrderProductSearch/>
                </SalesProductProvider>
                
                <div className="mt-3 border rounded overflow-auto" style={{ maxHeight: '400px'}}>
                  <SalesOrderProductTable/>
                  {errors.productList && <div className="custom-invalid-feedback">{errors.productList}</div>}
                </div>
              </div>

              {/* totales */}
              <div className="d-flex p-3">

                <div className="col-5"></div>

                <div className="col-7">
                  <div className="d-flex align-items-center gap-2">
                    <label className="form-label mt-2 w-50 text-end">SubTotal:</label>
                    <InputAmount className="form-control form-control-sm" value={obj.subTotal} readOnly={true}/>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <label className="form-label mt-2 w-50 text-end">IVA:</label>
                    <InputAmount className="form-control form-control-sm mt-2" value={obj.iva} readOnly={true}/>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <label className="form-label mt-2 w-50 text-end">Total:</label>
                    <InputAmount className="form-control form-control-sm mt-2" value={obj.total} readOnly={true}/>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* principal buttons */}
          <div className="row d-flex mt-4">
            <div className="col-6 col-sm">
              <ButtonWithConfirm className={"custom-btn-outline-danger w-100"} actionName={"Nuevo"} title={"Confirmación"} message={"Se perderán los datos no guardados ¿Desea Continuar?"} onExecute={cleanForm} />
            </div>

            <div className="col-6 col-sm">
              { obj.status == 1 && 
                <ButtonWithConfirm className={"custom-btn-success w-100"} actionName={"Guardar"} title={"Confirmación"} message={"Guardar la Orden ¿Desea Continuar?"} onExecute={saveForm} />
              }
            </div>
          </div>

        </div>
        
      </div>

      <Message screenMessage={screenMessage} onResetScreenMessage={resetScreenMessage}/>
    </div>
  )
}
