import { useState, useId, useEffect } from "react";

import { v4 as uuidv4 } from 'uuid';


import "../../index.css";
// import "../../common/css/table.css";

import { useUpdateOrder, useSearchOrder } from '../hooks/useOrder';

import { SalesOrderProductTable } from "../components/SalesOrderProductTable";
import { SalesOrderProductSearch } from "../components/SalesOrderProductSearch";
import { InputSearchWithTag } from "../../common/components/InputSearchWithTag";
import { InputAmount } from "../../common/components/InputAmount";
import { ButtonWithConfirm } from "../../common/components/ButtonWithConfirm";
import { SalesOrderButtonGeneratePricePDF } from "../components/SalesOrderButtonGeneratePricePDF";
import { SalesOrderTable } from "../components/SalesOrderTable";
import { SalesOrderSearch } from "../components/SalesOrderSearch";
import { Message } from "../../common/components/Message";
import { FaBars } from "react-icons/fa"; 

const initObj = {
  code          : "",
  customerIdDoc : "",
  customerName  : "",
  customerEmail : "",
  customerPhone : "",
  customerAddress: "",
  comment       : "",
  productList   : [],
  subTotal      : 0,
  iva           : 0,
  total         : 0,
  status        : 1
}

export const SalesOrderPage = () => {

  // * hooks
  const [orderList, setOrderList] = useState([]);
  const [order, setOrder] = useState(initObj);
  const [errors, setErrors] = useState({});
  const { mutateOrder, data, loading, error } = useUpdateOrder();
  const [cleanSearchInput, setCleanSearchInput] = useState(false);
  const [switchRestart, setSwitchRestart] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [isOpenSearchSection, setIsOpenSearchSection] = useState(true);
  const [isOpenOrderSection, setIsOpenOrderSection] = useState(true);
  
  console.log(`rendered... order=${JSON.stringify(order)}, orderList=(${orderList.length})${JSON.stringify(orderList)}`);

  // * handles
  const handleChange = (e) => {
    setOrder({ ...order, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: "" }); // Borra el error al escribir
  }

    // * search module
  const updateOrder = (order = {}, action) => {
    let orderListAux = [];

    if(action === "add") {
      orderListAux = [order, ...orderList];

    } else if(action === "update" || action === "delete") {
      orderListAux = orderList.map((value) => {
        if(value.id === order.id)
          return order;

        return value;
      })

    }

    if(action === "delete") {
      sendDeleteOrder(order); // TODO: enviar al backend graphql para eliminar la orden
    }


    setOrderList(orderListAux);
  }

  const updateOrderList = (orderList = [], action) => {
    setOrderList(orderList);
  }

  const loadOrder = (obj) => {
    const productListAux = obj.productList.map((value) => {
      return {
        ...value,
        key: uuidv4(),
        subTotal: value.qty * value.price
      }
    });

    const subTotal = productListAux.reduce((acc, value) => {
      if(value.status === 0)
        return acc;

      return acc + value.subTotal; // * acc only if status is 1=active
    }, 0);

    const iva = subTotal * 0.19; // TODO: parametrizar el iva
    const total = subTotal + iva;

    obj.productList = productListAux;
    obj.subTotal = subTotal;
    obj.iva = iva;
    obj.total = total;

    setSwitchRestart(!switchRestart);
    setOrder(obj);
    setErrors({});
  }

    // * create/update module
  const validate = () => {
    let newErrors = {};

    if (!order.customerName) newErrors.customerName = "Ingrese el nombre del cliente";
    if (order.productList.length === 0) newErrors.productList = "Ingrese uno ó mas productos a la lista";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Devuelve true si no hay errores
  }

  const onSearchCustomerList = (searchValue = '') => {

    // console.log(`onSearchProductList: searchValue="${searchValue}"`);
    // const searchList = [searchValue];

    // const { data } = await fetchProducts({ variables: { searchList } })
    // if (data) {
    //   const payload = data?.salesProductFind?.payload || [];
    //   console.log(`onSearchProductList: payload=(${JSON.stringify(payload)})`);
    //   return payload;
    // }

    // TODO: aqui debe ir la llamada al backend para buscar los productos
    if(searchValue.length < 3) return [];

    const list = [
      { id: 1, idDoc: "1.111.111-k", name: "Cliente Generico", email: "cliente@correo.com", address: "Av. Siempre Viva 1234" },
    ]

    const filteredList = list.filter((value) =>
      value.name.toLowerCase().includes(searchValue.toLowerCase())
    )

    return filteredList;
  }

  const updateSelectCustomer = (obj = {}) => {
    setErrors({ ...errors, customerName: "", customerIdDoc: "", customerAddress: "" }); // * remove customer error

    setOrder({
      ...order,
      customerName: obj.name,
      customerIdDoc: obj.idDoc,
      customerEmail: obj.email,
      customerAddress: obj.address
    })
  }

  const updateOrderProduct = (orderProduct = {}, action) => {
    let orderProductListAux = [];

    // TODO: crear enum para los actions
    if(action === "add") {
      setErrors({ ...errors, productList: "" }); // * remove the product list error
      orderProductListAux = [orderProduct, ...order.productList];

    } else if(action === "update" || action === "delete") {
      orderProductListAux = order.productList.map((value) => {
        if(value.key === orderProduct.key) {
          return orderProduct;
        }
        return value;
      });

    }

    // * calculate totals
    const subTotal = orderProductListAux.reduce((acc, value) => {
      if(value.status === 0)
        return acc;

      return acc + value.subTotal; // * acc only if status is 1=active
    }, 0);

    const iva = subTotal * 0.19; // TODO: parametrizar el iva
    const total = subTotal + iva;

    // * update order
    setOrder({
      ...order,
      productList: orderProductListAux,
      subTotal,
      iva,
      total
    })
  }

  const sendUpdateOrder = async () => {
   
    if(!validate()) return;

    // TODO: crear metodo para generar order to graphql
    const productListAux = order.productList.map((value) => {
      return {
        id: value.id,
        name: value.name,
        cost: parseFloat(value.cost),
        price: parseFloat(value.price),
        qty: parseFloat(value.qty),
        status: value.status
      }
    });

    const orderAux = {
      id: order.id ? order.id : undefined,
      code: order.code ? order.code : undefined,
      customerIdDoc: order.customerIdDoc,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      customerAddress: order.customerAddress,
      comment: order.comment,
      status: order.status,
      productList: productListAux
    }

    const { data } = await mutateOrder({ variables: { input: { ...orderAux } } });
    if (data) {
      const payload = data?.salesOrderUpdate?.payload || []; // TODO: DEBO DEVOLVER toda la data despues de gurdar para poder pintar en la lista
      setOrder(initObj);
      setCleanSearchInput(true);

      // *
      const found = orderList.find((value) => value.id === order.id) 
      const action = found ? "update" : "add";
      const orderAux = found ? order : payload[0];
      updateOrder(orderAux, action); // TODO: AQUI se debe enviar la orden que se acaba de guardar  y viene en el data del 251

      setShowMessage(true);
      console.log(`sendUpdateOrder: executed, payload=(${JSON.stringify(payload)})`);
    }
  }

  const cleanCustomer = () => {
    setOrder({ ...order, customerName: "", customerIdDoc: "", customerEmail: "", customerAddress: "" });
  }

  const sendDeleteOrder = async (order) => {

    // TODO: crear metodo para generar order to graphql
    const productListAux = order.productList.map((value) => {
      return {
        id: value.id,
        name: value.name,
        cost: parseFloat(value.cost),
        price: parseFloat(value.price),
        qty: parseFloat(value.qty),
        status: value.status
      }
    });

    const orderAux = {
      id: order.id,
      code: order.code,
      customerIdDoc: order.customerIdDoc,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      customerAddress: order.customerAddress,
      comment: order.comment,
      status: order.status,
      productList: productListAux
    }

    const { data } = await mutateOrder({ variables: { input: { ...orderAux } } });
    if (data) {
      const payload = data?.salesOrderUpdate?.payload || []; // TODO: DEBO DEVOLVER toda la data despues de gurdar para poder pintar en la lista
           
      // *
      const found = orderList.find((value) => value.id === order.id) 
      const action = found ? "update" : "add";
      const orderAux = found ? order : payload[0];
      updateOrder(orderAux, action); // TODO: AQUI se debe enviar la orden que se acaba de guardar  y viene en el data del 251
      setShowMessage(true);
    }
  }


  const cleanOrder = () => {
    // TODO: aqui validar o levantar un modal de confirmacion
    setOrder(initObj);
    setCleanSearchInput(true);
    setErrors({});
  }

  
  // * return component
  return (
    // <div className="row mt-3 animate__animated animate__fadeIn">
    <div className="row mt-3">
      
      {/* search */}
      <div className="col-sm-6 mb-3">
        
        <div className="border rounded p-3" style={{ maxHeight: '650px'}}>
          
          <div className="d-flex align-items-center gap-2">
            <span
              className="d-block d-md-none fs-2" // Se oculta en pantallas medianas y grandes
              onClick={() => setIsOpenSearchSection(!isOpenSearchSection)}
              style={{ cursor: "pointer" }}
            >
              <FaBars className="text-dark"/>
            </span>

            <h4 className="text-dark m-0">Búsqueda de Ordenes</h4>  
          </div>

          {/* <h4 className="mb-2">Búsqueda de Ordenes</h4> */}
          {isOpenSearchSection && (
          <div className="border rounded mt-3 p-3">
            <SalesOrderSearch onNotifyUpdateOrder={updateOrder} onNotifyUpdateOrderList={updateOrderList} isClean={cleanSearchInput}/>
            
            <div className="mt-3 overflow-auto" style={{ maxHeight: '500px'}}>
              <SalesOrderTable orderList={orderList} onNotifyUpdateOrder={updateOrder} onNotifySelectOrder={loadOrder}/>
            </div>
          </div>
          )}
        </div>
        
      </div>

      {/* update */}
      <div className="col-sm-6">

        <div className="border rounded p-3">

          {/* form */}
          <div className="overflow-auto" style={{ height: '650px'}}>

            {/* order */}
            <div className="d-flex align-items-center gap-2">
              <span
                className="fs-4" // Se oculta en pantallas medianas y grandes
                onClick={() => setIsOpenOrderSection(!isOpenOrderSection)}
                style={{ cursor: "pointer" }}
              >
                <FaBars className="text-dark"/>
              </span>

              <h5 className="text-dark m-0">Orden</h5>  
            </div>
            
            {isOpenOrderSection && (
            <div className="border rounded mt-2 p-3">
              <div className="d-flex gap-4">

                <div className="col-7 flex-wrap">
                  <label className="form-label text-end">Cliente:</label>

                  <InputSearchWithTag
                    name="customerName"
                    className={`form-control text-capitalize ${errors.customerName ? "is-invalid" : ""}`}
                    searchField={"name"}
                    value={order.customerName?.toLowerCase()} // ! Esto hace que se renderice 2 veces la pantalla
                    placeholder={"Buscador..."}
                    onNotifyChangeEvent={handleChange}
                    onSearchOptions={onSearchCustomerList}
                    onNotifySelectOption={updateSelectCustomer}
                    onNotifyRemoveTag={cleanCustomer}
                    switchRestart={switchRestart}
                  />
                  {errors.customerName && <div className="custom-invalid-feedback">{errors.customerName}</div>}
                </div>

                <div className="col-4 flex-wrap">
                  <label className="form-label text-end">RUT:</label>

                  <input
                    name="customerIdDoc"
                    className={`form-control ${errors.customerIdDoc ? "is-invalid" : ""}`}
                    type="text"
                    value={order.customerIdDoc?.toUpperCase()}
                    onChange={handleChange}
                  />
                </div>

              </div>

              <div className="flex-wrap mt-3 ">
                <label className="form-label">Email:</label>

                <input
                  name="customerEmail"
                  className={"form-control form-control-sm"}
                  type="text"
                  value={order.customerEmail?.toLowerCase()}
                  onChange={handleChange}
                />
              </div>

              <div className="flex-wrap mt-2">
                <label className="form-label">Dirección:</label>

                <input
                  name="customerAddress"
                  className="form-control form-control-sm text-capitalize"
                  value={order.customerAddress?.toLowerCase()}
                  onChange={handleChange}
                />
              </div>

              <div className="mt-3">
                <label className="form-label">Comentarios:</label>
                <textarea
                  name="comment"
                  className="form-control form-control-sm"
                  value={order.comment?.toLowerCase()}
                  onChange={handleChange}
                />
              </div>
            </div>
            )}

            {/* products */}
            <div className="mt-4">
              <h5 className="text-dark m-0">Productos de la Orden</h5>  
            </div>

            <div className="border rounded mt-2">  
              <div className="p-3">
                <SalesOrderProductSearch onNotifyUpdateOrderProduct={updateOrderProduct} isClean={cleanSearchInput}/>
                
                <div className="mt-3 overflow-auto" style={{ maxHeight: '400px'}}>
                  <SalesOrderProductTable orderProductList={order.productList} onNotifyUpdateOrderProduct={updateOrderProduct}/>
                  {errors.productList && <div className="custom-invalid-feedback border rounded p-1">{errors.productList}</div>}
                </div>
              </div>

              {/* totales */}
              <div className="d-flex p-3">

                <div className="col-5"></div>

                <div className="col-7">
                  <div className="d-flex align-items-center gap-2">
                    <label className="form-label mt-2 w-50 text-end">SubTotal:</label>
                    <InputAmount className="form-control form-control-sm" value={order.subTotal} readOnly={true}/>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <label className="form-label mt-2 w-50 text-end">IVA:</label>
                    <InputAmount className="form-control form-control-sm mt-2" value={order.iva} readOnly={true}/>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <label className="form-label mt-2 w-50 text-end">Total:</label>
                    <InputAmount className="form-control form-control-sm mt-2" value={order.total} readOnly={true}/>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* principal buttons */}
          <div className="d-flex mt-4 gap-1">
            <div className="col-4"><ButtonWithConfirm className={"btn btn-outline-danger w-100"} actionName={"Cancelar"} title={"Confirmación"} message={"Se perderán los datos no guardados ¿Desea Continuar?"} onExecute={cleanOrder} /></div>
            { order.status == 1 && <div className="col-4"><SalesOrderButtonGeneratePricePDF className={"btn btn-outline-success w-100"} actionName={"Imprimir"} orderData={order} onConfirm={validate}/></div>}
            { order.status == 1 && <div className="col-4"><ButtonWithConfirm className={"btn btn-success w-100"} actionName={"Guardar"} title={"Confirmación"} message={"Guardar la Orden ¿Desea Continuar?"} onExecute={sendUpdateOrder} /></div>}
          </div>

        </div>
        
      </div>

      <Message show={showMessage} onUpdateShowMessage={setShowMessage}/>

      {error && <p>Error: {JSON.stringify(error)}</p>}
      {/* {error && <p>Error: {error.message}</p>} */}
    </div>
  );
};
