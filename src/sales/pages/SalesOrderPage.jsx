import { useState, useId } from "react";

import { v4 as uuidv4 } from 'uuid';


import "../../index.css";

import { useUpdateOrder, useSearchOrder } from '../hooks/useOrder';

import { SalesOrderProductTable } from "../components/SalesOrderProductTable";
import { SalesOrderProductSearch } from "../components/SalesOrderProductSearch";
import { InputSearchWithTag } from "../../common/components/InputSearchWithTag";
import { InputAmount } from "../../common/components/InputAmount";
import { ButtonWithConfirm } from "../../common/components/ButtonWithConfirm";
import { SalesOrderButtonGeneratePricePDF } from "../components/SalesOrderButtonGeneratePricePDF";
import { SalesOrderTable } from "../components/SalesOrderTable";
import { SalesOrderSearch } from "../components/SalesOrderSearch";

const initOrderList = [
  { id: 1, customer: "Juan Pérez", status: "Pendiente" },
  { id: 2, customer: "Ana López", status: "Entregado" },
]

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

  console.log(`rendered... order=${JSON.stringify(order)}, orderList=(${orderList.length})${JSON.stringify(orderList)}`);

  // * handles
  const handleChange = (e) => {
    setOrder({ ...order, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: "" }); // Borra el error al escribir
    console.log(`handleChange: errors=${JSON.stringify(errors)}`);
  }

    // * search module
  const updateOrder = (order = {}, action) => {
    console.log(`updateOrder: order=${JSON.stringify(order)}`);

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
    console.log(`updateOrderList: order=${JSON.stringify(orderList)}`);

    setOrderList(orderList);
  }

  const loadOrder = (obj) => {
    console.log(`loadOrder: order=${JSON.stringify(order)}`);

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
    console.log(`sendUpdateOrder: order=${JSON.stringify(order)}`);
    // const { data } = await createOrder({ variables: { input: { ...formData, price: parseFloat(formData.price) } } });

    console.log(`sendUpdateOrder: errors=${JSON.stringify(errors)}`);

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

      
      console.log(`sendUpdateOrder: executed, payload=(${JSON.stringify(payload)})`);
    }
  }

  const cleanCustomer = () => {
    setOrder({ ...order, customerName: "", customerIdDoc: "", customerEmail: "", customerAddress: "" });
  }

  const sendDeleteOrder = async (order) => {
    console.log(`sendDeleteOrder: order=${JSON.stringify(order)}`);
    // const { data } = await createOrder({ variables: { input: { ...formData, price: parseFloat(formData.price) } } });

    
    

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
      
      console.log(`sendDeleteOrder: executed, payload=(${JSON.stringify(payload)})`);
    }
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
    // <div className="row mt-3 animate__animated animate__fadeIn">
    <div className="row mt-3">

      {/* search */}
      <div className="col-sm-6">
        <div className="border rounded p-3 overflow-auto" style={{ maxHeight: '750px'}}>
          <h4 className="mb-2">Búsqueda de Ordenes</h4>

          <div className="mt-3 p-3">
            {/* <div className="border rounded p-3 mb-3"> */}
              <SalesOrderSearch onNotifyUpdateOrder={updateOrder} onNotifyUpdateOrderList={updateOrderList} isClean={cleanSearchInput}/>
            {/* </div> */}
            <SalesOrderTable orderList={orderList} onNotifyUpdateOrder={updateOrder} onNotifySelectOrder={loadOrder}/>
          </div>
        </div>
      </div>

      {/* update */}
      <div className="col-sm-6">
        <div className="border rounded p-3">

          <div className="overflow-auto" style={{ height: '650px'}}>
          {/* principal form */}
          {/* <form onSubmit={handleSubmit} className="p-3"> */}

            {/* order fields */}
            <div className="border rounded p-3">

              <div className="d-flex gap-4">

                <div className="col-7 flex-wrap">
                  <label className="form-label text-end">Cliente:</label>

                  <InputSearchWithTag
                    name="customerName"
                    className={`form-control ${errors.customerName ? "is-invalid" : ""}`}
                    searchField={"name"}
                    value={order.customerName}
                    placeholder={"Buscador..."}
                    onNotifyChangeEvent ={handleChange}
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
                    value={order.customerIdDoc}
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
                  value={order.customerEmail}
                  onChange={handleChange}
                />
              </div>

              <div className="flex-wrap mt-3">
                <label className="form-label">Dirección:</label>

                <textarea
                  name="customerAddress"
                  className="form-control form-control-sm"
                  value={order.customerAddress}
                  onChange={handleChange}
                />
              </div>

            </div>

            <div className="mt-3">
              <label className="form-label">Comentarios:</label>
              <textarea
                name="comment"
                className="form-control form-control-sm"
                value={order.comment}
                onChange={handleChange}
              />
            </div>

          {/* </form> */}

          {/* product search */}
          <label className="form-label mt-3">Productos:</label>
          <div className="border rounded">
          <div className="p-3" >
            <SalesOrderProductSearch onNotifyUpdateOrderProduct={updateOrderProduct} isClean={cleanSearchInput}/>
            <SalesOrderProductTable orderProductList={order.productList} onNotifyUpdateOrderProduct={updateOrderProduct}/>
            {errors.productList && <div className="custom-invalid-feedback border rounded p-1">{errors.productList}</div>}
          </div>

          {/* totales */}
          <div className="d-flex p-3">

            <div className="col-7"></div>

            <div className="col-5">
              <div className="d-flex align-items-center gap-2">
                <label className="form-label mt-2 w-50 text-end">Sub-Total:</label>
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
            <div className="col-4"><ButtonWithConfirm className={"btn btn-outline-primary w-100"} actionName={"Cancelar"} title={"Confirmar Acción"} message={"Se Perderá La Información No Guardada ¿Desea Continuar?"} onExecute={cleanOrder} /></div>
            { order.status == 1 && <div className="col-4"><SalesOrderButtonGeneratePricePDF className={"btn btn-outline-primary w-100"} actionName={"Imprimir"} orderData={order} onConfirm={validate}/></div>}
            { order.status == 1 && <div className="col-4"><ButtonWithConfirm className={"btn btn-outline-primary w-100"} actionName={"Guardar"} title={"Confirmar Acción"} message={"Se Guardará La Información ¿Desea Continuar?"} onExecute={sendUpdateOrder} /></div>}
          </div>

        </div>
      </div>

      {error && <p>Error: {JSON.stringify(error)}</p>}
      {/* {error && <p>Error: {error.message}</p>} */}
    </div>
  );
};
