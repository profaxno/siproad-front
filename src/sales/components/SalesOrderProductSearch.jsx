import { v4 as uuidv4 } from 'uuid';
import React, { useState } from 'react'
import { InputAmount } from '../../common/components/InputAmount';
import { InputSearch } from '../../common/components/InputSearch';

export const SalesOrderProductSearch = ({onNotifyUpdateOrderProduct}) => {

  const initOrderProduct = {
    key: 0,
    id: 0,
    name: '',
    qty: 1, 
    price: 1,
    discountPct: 0,
    subTotal: 0,
    status: 1 // * 1: active, 0: inactive
  }
  
  // * hooks
  const [orderProduct, setOrderProduct] = useState(initOrderProduct);
  
  console.log(`rendered...`);


  // * handles
  const handleInputQtyChange = (e) => {
    const { target } = e;
    const { name, value } = target;
    
    console.log(`onInputChange: ${JSON.stringify({name, value})}`);

    setOrderProduct({
      ...orderProduct,
      qty: value,
      subTotal: value * orderProduct.price
    })
  }

  const handleAddOrderProduct = (orderProduct) => {
    console.log(`handleAddOrderProduct: orderProduct=${JSON.stringify(orderProduct)}`);

    // * validate
    if(orderProduct.name === '') return;

    if(orderProduct.qty < 1) return;

    setOrderProduct(initOrderProduct);
    console.log(`handleAddOrderProduct: notifying to saleOrder...`);
    onNotifyUpdateOrderProduct(orderProduct); 
  }
  
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
  
  const onSearchProductList = (searchValue) => {

    if(searchValue.length < 3) return [];
    
    // TODO: aqui debe ir la llamada al backend para buscar los productos
    const list = [
      { id: 1, name: "Teclado", price: 100 },
      { id: 2, name: "Monitor", price: 200 },
      { id: 3, name: "Mouse", price: 300 },
      { id: 4, name: "Laptop", price: 400 },
      { id: 5, name: "Móvil", price: 500 }
    ]    

    const filteredList = list.filter((value) =>
      value.name.toLowerCase().includes(searchValue.toLowerCase())
    )

    return filteredList;
  }

  const updateSelectProduct = (obj) => {
    console.log(`updateSelectProduct: obj=${JSON.stringify(obj)}`);

    setOrderProduct({
      ...orderProduct,
      key: uuidv4(),
      id: obj.id,
      name: obj.name,
      price: obj.price,
      subTotal: orderProduct.qty * obj.price
    });
  }


  // * return component
  return (
    <>
      <div className="d-flex gap-2 mb-2">

        <div className="position-relative" style={{ flex: "70%" }}>
          <InputSearch 
            className={"form-control"} 
            searchField={"name"} 
            value={orderProduct.name}
            placeholder={"Buscador de productos..."} 
            onSearchOptions={onSearchProductList} 
            onNotifySelectOption={updateSelectProduct}
          />
        </div>

        {/* <div className="position-relative" style={{ flex: "70%" }}>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Escribe aquí..."
            className="form-control"
          />

          {filteredOptions.length > 0 && (
            <ul className="list-group position-absolute w-100" style={{ maxHeight: "150px", overflowY: "auto", zIndex: 1000 }}>
              {filteredOptions.map((option) => (
                <li
                  key={option.id}
                  onClick={() => handleSelectOption(option)}
                  className="list-group-item list-group-item-action"
                >
                  {option.name}
                </li>
              ))}
            </ul>
          )}
        </div> */}

        {/* <div style={{ flex: "70%" }}>
          <select
            className="form-select"
            value={orderProduct.name}
            isSearchable
            onInputChange={(input) => console.log("Texto ingresado:", input)}
            onChange={handleChangeProduct}
          >
            <option value="">Buscador productos...</option>
            {
              initProductList.map( (value) => (
                <option key={value.id} id={value.id} value={value.name} price={value.price}>{value.name}</option>
              ))
            }
          </select>
        </div> */}

        <div style={{ flex: "20%" }}>
          <InputAmount 
            name={"qty"} 
            className={"form-control"} 
            value={orderProduct.qty} 
            onChange={handleInputQtyChange} 
            placeholder={"Cantidad"}/>
        </div>
        
        {/* <input 
          name="qty"
          className="form-control w-20" 
          style={{ flex: "20%" }} 
          type="number" 
          placeholder="Cantidad"
          step="any" 
          min="1" 
          defaultValue="1"
          onChange={handleInputQtyChange}
        /> */}
        
        <div style={{ flex: "10%" }}>
          <button 
            name='btnAddOrderProduct'
            className="btn btn-outline-success"            
            onClick={() => handleAddOrderProduct(orderProduct) }
          >
            +
          </button>
        </div>

      </div>
    </>
  )
}
