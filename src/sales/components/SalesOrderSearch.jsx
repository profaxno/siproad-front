import { v4 as uuidv4 } from 'uuid';
import React, { use, useState, useEffect } from 'react'
import { InputAmount } from '../../common/components/InputAmount';
import { InputSearch } from '../../common/components/InputSearch';
import { useSearchOrder } from '../hooks/useOrder';

const initOrderProduct = {
  key: 0,
  id: 0,
  name: '',
  code: '',
  qty: 1,
  cost: 0,
  price: 0,
  discountPct: 0,
  subTotal: 0,
  status: 1 // * 1: active, 0: inactive
}

export const SalesOrderSearch = ({onNotifyUpdateOrder, onNotifyUpdateOrderList}) => {
  
  // * hooks
  const [inputValue, setInputValue] = useState();
  const [orderProduct, setOrderProduct] = useState(initOrderProduct);
  const { fetchOrders, orderList = [], loading, error } = useSearchOrder();

  console.log(`rendered...`);

  // * handles
  const handleInputChange = async(e) => {
    const value = e.target.value;
    console.log(`handleInputChange: value="${value}"`);

    setInputValue(value);

    if(value.length < 3) {
      onNotifyUpdateOrderList([]);
      return;
    }

    const searchList = [value];

    const { data } = await fetchOrders({ variables: { searchList } })
    if (data) {
      const payload = data?.salesOrderFind?.payload || [];
      console.log(`onSearchObjectList: payload=(${JSON.stringify(payload)})`);
      onNotifyUpdateOrderList(payload);
    }

  }

  // const validate = () => {
  //   let newErrors = {};

  //   if (!(orderProduct.id && orderProduct.name)) newErrors.name = "Producto es requerido";
  //   if (!orderProduct.qty) newErrors.qty = "Cantidad es requerido";
    
  //   console.log(`validate: newErrors=${JSON.stringify(newErrors)}`);
  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0; // Devuelve true si no hay errores
  // }

  // const handleInputQtyChange = (e) => {
  //   const { target } = e;
  //   const { name, value } = target;
    
  //   setErrors({ ...errors, [e.target.name]: "" }); // Borra el error al escribir

  //   console.log(`onInputChange: ${JSON.stringify({name, value})}`);
  //   handleChange(e);

  //   setOrderProduct({
  //     ...orderProduct,
  //     qty: value,
  //     subTotal: value * orderProduct.price
  //   })
  // }

  // const handleAddOrderProduct = (orderProduct) => {
  //   console.log(`handleAddOrderProduct: orderProduct=${JSON.stringify(orderProduct)}`);

  //   // * validate
  //   if(!validate()) return;
  //   if(orderProduct.name === '') return;
  //   if(orderProduct.qty < 1) return;
    
  //   setOrderProduct(initOrderProduct);
  //   //setClean(true);
  //   console.log(`handleAddOrderProduct: notifying to saleOrder...`);
  //   onNotifyUpdateOrderProduct(orderProduct, 'add'); 
  // }
  
  // const handleChangeProduct = (e) => {
  //   const { target } = e;
  //   const selectedIndex   = target.options.selectedIndex;
  //   const selectedOption  = target.options[selectedIndex];
  //   const id     = selectedOption.getAttribute('id');
  //   const name   = target.value;
  //   const price  = selectedOption.getAttribute('price');

  //   console.log(`handleChange: id=${id}, value=${name}, price=${price}`);
    
  //   setOrderProduct({
  //     ...orderProduct,
  //     key: uuidv4(),
  //     id: id, 
  //     name: name,
  //     price: price,
  //     subTotal: orderProduct.qty * price
  //   });
  // }

  // TODO: este metodo es el que busca los productos en el backend
  
  const onSearchObjectList = async(searchValue) => {
    console.log(`onSearchObjectList: searchValue="${searchValue}"`);
    const searchList = [searchValue];

    const { data } = await fetchOrders({ variables: { searchList } })
    if (data) {
      const payload = data?.salesOrderFind?.payload || [];
      console.log(`onSearchObjectList: payload=(${JSON.stringify(payload)})`);
      return payload;
    }
  }

  const updateSelectObject = (obj) => {
    console.log(`updateSelectObject: obj=${JSON.stringify(obj)}`);

    setOrderProduct({
      ...orderProduct,
      key: uuidv4(),
      id: obj.id,
      name: obj.name,
      code: obj.code,
      cost: obj.cost,
      price: obj.price,
      subTotal: orderProduct.qty * obj.price
    });
  }

  const cleanInput = () => {
    setOrderProduct(initOrderProduct);
  }


  // * return component
  return (
    <>
      <div className="d-flex gap-2 mb-2">

        <div className="col-6">
          {/* <InputSearch 
            name="name"
            className={"form-control"} 
            searchField={"name"} 
            value={orderProduct.name}
            placeholder={"Buscador de productos..."}
            onNotifyChangeEvent={handleChange}
            onSearchOptions={onSearchObjectList} 
            onNotifySelectOption={updateSelectObject}
            onNotifyRemoveTag={cleanInput}
          /> */}
          <input
            name="description"
            type="text"
            className={"form-control"} 
            value={inputValue}
            onChange={handleInputChange}
            // onKeyDown={handleKeyDown}
            placeholder={"Descripción..."}
          />
        </div>

        {/* <div className="col-sm-2">
          <InputAmount 
            name={"qty"} 
            className={"form-control"} 
            value={orderProduct.qty} 
            onChange={handleInputQtyChange} 
            placeholder={"Cantidad"}
          />
          {errors.qty && <div className="custom-invalid-feedback">{errors.qty}</div>}
        </div> */}
        
        {/* <div className="col-sm-1">
          <button 
            name='btnAddOrderProduct'
            className="btn btn-outline-success"            
            onClick={() => handleAddOrderProduct(orderProduct) }
          >
            +
          </button>
        </div> */}

        {/* {error && <p>Error: {JSON.stringify(error)}</p>} */}
        {error && <p>Error: {error.message}</p>}
      </div>
    </>
  )
}
