import { v4 as uuidv4 } from 'uuid';
import React, { use, useState, useEffect } from 'react'
import { InputAmount } from '../../common/components/InputAmount';
import { InputSearchWithTag } from '../../common/components/InputSearchWithTag';
import { useProduct } from '../hooks/useProduct';

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

export const SalesOrderProductSearch = ({onNotifyUpdateOrderProduct}) => {
  
  // * hooks
  const [orderProduct, setOrderProduct] = useState(initOrderProduct);
  const [errors, setErrors] = useState({});
  const [clean, setClean] = useState(false);
  const { fetchProducts, productList = [], loading, error } = useProduct();

  console.log(`rendered...`);

  // * handles
  const handleChange = (e) => {
    setOrderProduct({ ...orderProduct, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: "" }); // Borra el error al escribir
  }

  const validate = () => {
    let newErrors = {};

    if (!(orderProduct.id && orderProduct.name)) newErrors.name = "Ingrese el nombre del producto a buscar";
    if (!orderProduct.qty) newErrors.qty = "Ingrese la cantidad";
    
    setErrors(newErrors);
    
    return Object.keys(newErrors).length === 0; // Devuelve true si no hay errores
  }

  const handleInputQtyChange = (e) => {
    const { target } = e;
    const { name, value } = target;
    
    setErrors({ ...errors, [e.target.name]: "" }); // Borra el error al escribir

    handleChange(e);

    setOrderProduct({
      ...orderProduct,
      qty: value,
      subTotal: value * orderProduct.price
    })
  }

  const handleButtonAdd = (orderProduct) => {
    // * validate
    if(!validate()) return;
    if(orderProduct.name === '') return;
    if(orderProduct.qty < 1) return;
    
    setOrderProduct(initOrderProduct);
    onNotifyUpdateOrderProduct(orderProduct, 'add'); 
  }
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
    const searchList = [searchValue];

    const { data } = await fetchProducts({ variables: { searchList } })
    if (data) {
      const payload = data?.salesProductFind?.payload || [];      
      return payload;
    }
  }

  const updateSelectObject = (obj) => {
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
      <div className="d-flex gap-1 mb-2">

        <div className="col-9">
          <InputSearchWithTag 
            name="name"
            className={`form-control ${errors.name ? "is-invalid" : ""}`}
            searchField={"name"} 
            value={orderProduct.name}
            placeholder={"Buscador..."}
            onNotifyChangeEvent={handleChange}
            onSearchOptions={onSearchObjectList}
            onNotifySelectOption={updateSelectObject}
            onNotifyRemoveTag={cleanInput}
          />
          {errors.name && <div className="custom-invalid-feedback">{errors.name}</div>}
        </div>

        <div className="col-2">
          <InputAmount 
            name={"qty"}
            className={`form-control ${errors.qty ? "is-invalid" : ""}`}
            value={orderProduct.qty}
            onChange={handleInputQtyChange}
            placeholder={"Cantidad"}
          />
          {errors.qty && <div className="custom-invalid-feedback">{errors.qty}</div>}
        </div>
        
        <div className="col-1">
          <button 
            name='btnAddOrderProduct'
            className="btn btn-outline-success"            
            onClick={() => handleButtonAdd(orderProduct) }
          >
            +
          </button>
        </div>

        {/* {error && <p>Error: {JSON.stringify(error)}</p>} */}
        {error && <p>Error: {error.message}</p>}
      </div>
    </>
  )
}
