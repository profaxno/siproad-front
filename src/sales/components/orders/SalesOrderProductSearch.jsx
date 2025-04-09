import { useState, useContext } from 'react'

// import { v4 as uuidv4 } from 'uuid';

import { SalesOrderContext } from '../../context/SalesOrderContext';
import { SalesProductContext } from '../../context/SalesProductContext';

import { InputAmount, InputSearchWithTag } from '../../../common/components';
import { TableActionEnum } from '../../../common/enums/table-actions.enum';

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

export const SalesOrderProductSearch = () => {
  
  // * hooks
  const { updateTableOrderProduct } = useContext(SalesOrderContext);
  const { findProducts } = useContext(SalesProductContext);

  const [orderProduct, setOrderProduct] = useState(initOrderProduct);
  const [errors, setErrors] = useState({});
  const [clean, setClean] = useState(false);
  
  console.log(`rendered...`);

  // * handles
  const handleChange = (e) => {
    setOrderProduct({ ...orderProduct, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: "" });
  }

  const validate = () => {
    let newErrors = {};

    if (!(orderProduct.id && orderProduct.name)) newErrors.name = "Ingrese el nombre del producto a buscar";
    if (!orderProduct.qty) newErrors.qty = "Ingrese la cantidad";
    
    setErrors(newErrors);
    
    return Object.keys(newErrors).length === 0; // Devuelve true si no hay errores
  }

  const updateSelectObject = (obj) => {
    
    setOrderProduct({
      ...orderProduct,
      // key: uuidv4(),
      id: obj.id,
      name: obj.name,
      code: obj.code,
      cost: obj.cost,
      price: obj.price,
      subTotal: orderProduct.qty * obj.price
      // active: true
    });

    // setOrderProduct({
    //   ...orderProduct,
    //   // key: uuidv4(),
    //   id: obj.id,
    //   name: obj.name,
    //   cost: obj.cost,
    //   unit: obj.unit,
    //   active: true
    // });
    
  }

  const handleButtonAdd = (orderProduct) => {
    // * validate
    if(!validate()) return;
    
    if(orderProduct.name === '') return;
    if(orderProduct.qty < 0) return;
    
    updateTableOrderProduct(orderProduct, TableActionEnum.ADD);
    setOrderProduct(initOrderProduct);
  }

  const cleanInput = () => {
    setOrderProduct(initOrderProduct);
  }

  // * return component
  return (
    
    <div className="d-flex gap-1 mb-2">

      <div className="col-9">
        <InputSearchWithTag 
          name="name"
          className={`form-control ${errors.name ? "is-invalid" : ""}`}
          searchField={"name"} 
          value={orderProduct.name}
          placeholder={"Buscador..."}
          onNotifyChangeEvent={handleChange}
          onSearchOptions={findProducts}
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
          onChange={handleChange}
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

    </div>
  )
}
