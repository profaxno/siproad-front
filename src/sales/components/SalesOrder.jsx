import { useState, useId, useEffect } from "react";

import { SalesOrderCmbCustomers } from "./SalesOrderCmbCustomers";
import { SalesOrderProductTable } from "./SalesOrderProductTable";
import { SalesOrderProductSearch } from "./SalesOrderProductSearch";
import { InputAmount } from "../../common/components/InputAmount";
import { InputSearch } from "../../common/components/InputSearch";
import { ButtonWithConfirm } from "../../common/components/ButtonWithConfirm";

const initOrderList = [
  { id: 1, customer: "Juan Pérez", status: "Pendiente" },
  { id: 2, customer: "Ana López", status: "Entregado" },
]

export const SalesOrder = () => {
  
  const initObj = {
      customer: {
        id: 0,
        name: ""
      },
      comment: "",
      orderProductList: [],
      subTotal: 0,
      iva: 0,
      total: 0,
      status: "Pendiente"
  }

  // * hooks
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState(initObj);
  
  useEffect(() => {
    console.log(`useEffect: orders=${JSON.stringify(orders)}`);
  }, []);

  console.log(`rendered... orderProductList=(${order.orderProductList.length})${JSON.stringify(order.orderProductList)}`);


  // * handles
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`handleSubmit: order=${JSON.stringify(order)}`);
    // TODO: enviar al backend graphql
    
  };

  const onSearchCustomerList = (searchValue = '') => {

    // TODO: aqui debe ir la llamada al backend para buscar los productos
    if(searchValue.length < 3) return [];

    const list = [
      { id: 1, name: "Jhossymer Maita" },
      { id: 2, name: "Ivan Perez"}
    ]    

    const filteredList = list.filter((value) =>
      value.name.toLowerCase().includes(searchValue.toLowerCase())
    )

    return filteredList;
  }

  const updateSelectCustomer = (obj = {}) => {
    console.log(`updateSelectCustomer: obj=${JSON.stringify(obj)}`);
    setOrder({
      ...order,
      customer: obj
    })
  }
  
  const updateOrderProduct = (orderProduct = {}) => {
    console.log(`updateOrderProduct: orderProduct=${JSON.stringify(orderProduct)}`);

    let orderProductListAux = order.orderProductList.filter((value) => value.key !== orderProduct.key);
    orderProductListAux.push(orderProduct);

    // * calculate totals
    const subTotal = orderProductListAux.reduce((acc, value) => {
      if(value.status === 0) 
        return acc;

      return acc + value.subTotal; // * acc only if status is 1=active
    }, 0);

    const iva = subTotal * 0.19;
    const total = subTotal + iva;

    // * update order
    setOrder({
      ...order,
      orderProductList: orderProductListAux,
      subTotal,
      iva,
      total
    })
  }

  const updateOrder = () => {
    console.log(`updateOrder: order=${JSON.stringify(order)}`);
    setOrder(initObj);
    // TODO: aqui enviar al backend graphql
  }

  const cleanOrder = () => {
    console.log(`cleanOrder: order=${JSON.stringify(order)}`);
    // TODO: aqui validar o levantar un modal de confirmacion
    setOrder(initObj);
  }


  // * return component
  return ( 
    <div className="row">

      {/* search */}
      <div className="col-md-6 border rounded p-3">
        <h2 className="mb-2">Ordenes</h2>
        
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {initOrderList.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customer}</td>
                  <td>
                    <span className={`badge ${order.status === "Pendiente" ? "bg-warning" : order.status === "Entregado" ? "bg-success" : "bg-danger"}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* update */}
      <div className="col-md-6 border rounded p-3">
        
        {/* principal form */}
        {/* <form onSubmit={handleSubmit} className="p-3"> */}

          {/* order fields */}
          <div>
            <label className="form-label">Cliente:</label>
            {/* <SalesOrderCmbCustomers/> */}
            <InputSearch 
              className={"form-control"} 
              searchField={"name"} 
              value={order.customer.name}
              placeholder={"Buscador de clientes..."} 
              onSearchOptions={onSearchCustomerList} 
              onNotifySelectOption={updateSelectCustomer}
            />
          </div>

          <div className="mt-3">
            <label className="form-label">Comentarios:</label>
            <textarea
              name="comment"
              className="form-control"
              value={order.comment}
              onChange={(e) => setOrder({ ...order, comment: e.target.value })}
            />
          </div>

        {/* </form> */}

        {/* product search */}  
        <div className="mt-5">
          <h4>Productos</h4>
          <SalesOrderProductSearch onNotifyUpdateOrderProduct={updateOrderProduct}/>
          <SalesOrderProductTable orderProductList={order.orderProductList} onNotifyUpdateOrderProduct={updateOrderProduct}/>
        </div>

        {/* totales */}
        <div className="d-flex mt-4">

          <div style={{ flex: "50%" }}></div>

          <div style={{ flex: "50%" }}>
            <div className="d-flex align-items-center">
              <label className="form-label" style={{ flex: "40%" }}>Sub-Total:</label>
              <InputAmount className="input-style form-control" value={order.subTotal} readOnly={true}/>
              {/* <input type="number" className="form-control" value={order.subTotal}/> */}
            </div>
            
            <div className="d-flex align-items-center">
              <label className="form-label" style={{ flex: "40%" }}>IVA:</label>
              <InputAmount className="input-style form-control mt-2" value={order.iva} readOnly={true}/>
              {/* <input type="number" className="form-control mt-2" value={order.iva}/> */}
            </div>
            
            <div className="d-flex align-items-center">
              <label className="form-label" style={{ flex: "40%" }}>Total:</label>
              <InputAmount className="input-style form-control mt-2" value={order.total} readOnly={true}/>
              {/* <input type="number" className="form-control mt-2" value={order.total}/> */}
            </div>
          </div>

        </div>

        {/* principal buttons */}
        <div className="mt-4">
          <div className="d-flex">
            
            <ButtonWithConfirm className={"btn btn-outline-primary w-10"} style={{ flex: "50%" }} actionName={"Cancelar"} title={"Confirmar Acción"} message={"Se Perderá La Información No Guardada ¿Desea Continuar?"} onExecute={cleanOrder}/>
            <ButtonWithConfirm className={"btn btn-primary w-10"} style={{ flex: "50%" }} actionName={"Guardar"} title={"Confirmar Acción"} message={"Se Guardará La Información ¿Desea Continuar?"} onExecute={updateOrder}/>

            {/* <button className="btn btn-outline-primary w-10" style={{ flex: "50%" }} onClick={() => setShowModal(true)}>Cancelar</button> */}
            {/* <button className="btn btn-primary w-10" style={{ flex: "50%" }} onClick={updateOrder}>Guardar</button> */}
          </div>
        </div>
        
      </div>

    </div>
  );
};
