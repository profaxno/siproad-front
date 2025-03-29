import { useState, useId, useEffect } from "react";
import "../../index.css";

import { useOrder } from '../hooks/useOrder';

import { SalesOrderProductTable } from "./SalesOrderProductTable";
import { SalesOrderProductSearch } from "./SalesOrderProductSearch";
import { InputSearch } from "../../common/components/InputSearch";
import { InputAmount } from "../../common/components/InputAmount";
import { ButtonWithConfirm } from "../../common/components/ButtonWithConfirm";
import { SalesOrderButtonGeneratePricePDF } from "./SalesOrderButtonGeneratePricePDF";

const initOrderList = [
  { id: 1, customer: "Juan Pérez", status: "Pendiente" },
  { id: 2, customer: "Ana López", status: "Entregado" },
]

const initObj = {
  customerIdDoc: "",
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  customerAddress: "",
  comment: "",
  productList: [],
  subTotal: 0,
  iva: 0,
  total: 0,
  status: 1
}

export const SalesOrder = () => {

  // * hooks
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState(initObj);
  const [errors, setErrors] = useState({});
  const { createOrder, data, loading, error } = useOrder();
  const [cleanSearchInput, setCleanSearchInput] = useState(false);


  console.log(`rendered... orderProductList=(${order.productList.length})${JSON.stringify(order.productList)}`);


  // * handles
  const handleChange = (e) => {
    setOrder({ ...order, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: "" }); // Borra el error al escribir
    console.log(`handleChange: errors=${JSON.stringify(errors)}`);
  }

  const validate = () => {
    let newErrors = {};

    if (!order.customerName) newErrors.customerName = "Cliente es requerido";
    if (order.productList.length === 0) newErrors.productList = "1 ó mas productos deben ser agregados a la lista";
    
    console.log(`validate: newErrors=${JSON.stringify(newErrors)}`);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Devuelve true si no hay errores
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`handleSubmit: order=${JSON.stringify(order)}`);
    // TODO: enviar al backend graphql
    
  };

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
      { id: 1, idDoc: "25.830.201-k", name: "Jhossymer Maita", email: "jhossymer.maita@gmail.com", address: "Calle 1234" },
      { id: 2, idDoc: "25.574.415-1", name: "Ivan Perez", email: "ivanmperezt@gmail.com", address: "" }
    ]    

    const filteredList = list.filter((value) =>
      value.name.toLowerCase().includes(searchValue.toLowerCase())
    )

    return filteredList;
  }

  const updateSelectCustomer = (obj = {}) => {
    console.log(`updateSelectCustomer: obj=${JSON.stringify(obj)}`);

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
    console.log(`updateOrderProduct: orderProduct=${JSON.stringify(orderProduct)}`);

    let orderProductListAux = [];

    // TODO: crear enum para los actions
    if(action === "add") {
      setErrors({ ...errors, productList: "" }); // * remove the product list error
      orderProductListAux = [...order.productList, orderProduct];

    } else if(action === "update" || action === "delete") {
      orderProductListAux = order.productList.map((value) => {
        if(value.key === orderProduct.key) {
          return orderProduct;
        }
        return value;
      });

    }


    // let orderProductListAux = order.productList.filter((value) => value.key !== orderProduct.key);
    // orderProductListAux.push(orderProduct);

    // let orderProductListAux = order.productList.map((value) => {
    //   if(value.key === orderProduct.key) {
    //     return orderProduct;
    //   }
    //   return value;
    // });

    // if(orderProductListAux.length === 0) {
    //   orderProductListAux.push(orderProduct);
    // }

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

  const updateOrder = async () => {
    console.log(`updateOrder: order=${JSON.stringify(order)}`);
    // const { data } = await createOrder({ variables: { input: { ...formData, price: parseFloat(formData.price) } } });

    console.log(`updateOrder: errors=${JSON.stringify(errors)}`);

    if(!validate()) return;

    // TODO: crear metodo para generar order to graphql
    const productListAux = order.productList.map((value) => {
      return {
        id: value.id,
        name: value.name,
        cost: parseFloat(value.cost),
        price: parseFloat(value.price),
        qty: parseFloat(value.qty)
      }
    });
     
    const orderAux = {
      id: order.id ? order.id : undefined,
      customerIdDoc: order.customerIdDoc,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      customerAddress: order.customerAddress,
      comment: order.comment,
      productList: productListAux,
      // status: order.status,
    }
    
    const { data } = await createOrder({ variables: { input: { ...orderAux } } });
    if (data) {
      setOrder(initObj);
      setCleanSearchInput(true);

      const payload = data?.salesOrderUpdate?.payload || [];
      console.log(`updateOrder: executed, payload=(${JSON.stringify(payload)})`);
    }
  }

  const cleanCustomer = () => {
    setOrder({ ...order, customerName: "", customerIdDoc: "", customerEmail: "", customerAddress: "" });
  }

  const cleanOrder = () => {
    console.log(`cleanOrder: order=${JSON.stringify(order)}`);
    // TODO: aqui validar o levantar un modal de confirmacion
    setOrder(initObj);
    setCleanSearchInput(true);
    setErrors({});
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
          <div className="border rounded p-3">
            <div className="d-flex gap-3 align-items-center">
              <label className="form-label" style={{ flex: "20%" }}>Cliente:</label>
              {/* <SalesOrderCmbCustomers/> */}

              <div style={{ flex: "100%" }}>
                <InputSearch 
                  name="customerName"
                  className={"form-control"} 
                  searchField={"name"}
                  value={order.customerName}
                  placeholder={"Buscador de clientes..."} 
                  onNotifyChangeEvent ={handleChange}
                  onSearchOptions={onSearchCustomerList} 
                  onNotifySelectOption={updateSelectCustomer}
                  onNotifyRemoveTag={cleanCustomer}
                />
                {errors.customerName && <div className="custom-invalid-feedback">{errors.customerName}</div>}
              </div>
              
            </div>

            <div className="d-flex mt-3 gap-3 align-items-center">
              <label className="form-label" style={{ flex: "20%" }}>RUT:</label>
              <input
                name="customerIdDoc"
                className={`form-control ${errors.customerIdDoc ? "is-invalid" : ""}`}
                type="text"
                value={order.customerIdDoc}
                onChange={handleChange}
              />
              {/* {errors.customerIdDoc && <div className="invalid-feedback">{errors.customerIdDoc}</div>} */}
            </div>

            <div className="d-flex mt-3 gap-3 align-items-center">
              <label className="form-label" style={{ flex: "20%" }}>Email:</label>
              <input
                name="customerEmail"
                className={`form-control`}
                type="text"
                value={order.customerEmail}
                onChange={handleChange}
              />
            </div>

            <div className="d-flex mt-3 gap-3 align-items-center">
              <label className="form-label" style={{ flex: "20%" }}>Dirección:</label>
              <textarea
                name="customerAddress"
                className="form-control"
                value={order.customerAddress}
                onChange={handleChange}
              />
            </div>

          </div>

          <div className="mt-3">
            <label className="form-label">Comentarios:</label>
            <textarea
              name="comment"
              className="form-control"
              value={order.comment}
              onChange={handleChange}
            />
          </div>

        {/* </form> */}

        {/* product search */}  
        <div className="mt-3">
          {/* <h4>Productos: </h4> */}
          <label className="form-label">Productos:</label>
          <SalesOrderProductSearch onNotifyUpdateOrderProduct={updateOrderProduct} isClean={cleanSearchInput}/>
          <SalesOrderProductTable orderProductList={order.productList} onNotifyUpdateOrderProduct={updateOrderProduct}/>
          {errors.productList && <div className="custom-invalid-feedback">{errors.productList}</div>}
        </div>

        {/* totales */}
        <div className="d-flex mt-4">

          <div style={{ flex: "50%" }}></div>

          <div style={{ flex: "50%" }}>
            <div className="d-flex align-items-center">
              <label className="form-label" style={{ flex: "50%" }}>Sub-Total:</label>
              <InputAmount className="input-style form-control" value={order.subTotal} readOnly={true}/>
              {/* <input type="number" className="form-control" value={order.subTotal}/> */}
            </div>
            
            <div className="d-flex align-items-center">
              <label className="form-label" style={{ flex: "50%" }}>IVA:</label>
              <InputAmount className="input-style form-control mt-2" value={order.iva} readOnly={true}/>
              {/* <input type="number" className="form-control mt-2" value={order.iva}/> */}
            </div>
            
            <div className="d-flex align-items-center">
              <label className="form-label" style={{ flex: "50%" }}>Total:</label>
              <InputAmount className="input-style form-control mt-2" value={order.total} readOnly={true}/>
              {/* <input type="number" className="form-control mt-2" value={order.total}/> */}
            </div>
          </div>

        </div>

        {/* principal buttons */}
        <div className="mt-4">
          <div className="d-flex gap-1">
            <SalesOrderButtonGeneratePricePDF className={"btn btn-outline-primary w-10"} style={{ flex: "100%" }} actionName={"Generar PDF"} order={order}/>
            <ButtonWithConfirm className={"btn btn-outline-primary w-10"} style={{ flex: "20%" }} actionName={"Cancelar"} title={"Confirmar Acción"} message={"Se Perderá La Información No Guardada ¿Desea Continuar?"} onExecute={cleanOrder}/>
            <ButtonWithConfirm className={"btn btn-primary w-10"}         style={{ flex: "20%" }} actionName={"Guardar"}  title={"Confirmar Acción"} message={"Se Guardará La Información ¿Desea Continuar?"} onExecute={updateOrder}/>

            {/* <button className="btn btn-outline-primary w-10" style={{ flex: "50%" }} onClick={() => setShowModal(true)}>Cancelar</button> */}
            {/* <button className="btn btn-primary w-10" style={{ flex: "50%" }} onClick={updateOrder}>Guardar</button> */}
          </div>
        </div>
        
      </div>
      
      {error && <p>Error: {JSON.stringify(error)}</p>}
      {/* {error && <p>Error: {error.message}</p>} */}
    </div>
  );
};
