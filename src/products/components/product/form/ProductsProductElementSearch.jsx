import { useState, useContext } from 'react'

// import { v4 as uuidv4 } from 'uuid';

import { ProductsProductContext } from '../../../context/ProductsProductContext';
import { ProductsElementContext } from '../../../context/ProductsElementContext';

import { InputAmount } from '../../../../common/components/InputAmount';
import { InputSearchWithTag } from '../../../../common/components/InputSearchWithTag';
import { TableActionEnum } from '../../../enums/table-actions.enum';

const initProductElement = {
  key: 0,
  id: 0,
  name: '',
  qty: 1,
  status: 1 // * 1: active, 0: inactive
}

export const ProductsProductElementSearch = ({onNotifyUpdateTable}) => {
  
  // * hooks
  const { updateTableProductElement } = useContext(ProductsProductContext);
  const { findElements } = useContext(ProductsElementContext);

  const [productElement, setProductElement] = useState(initProductElement);
  const [errors, setErrors] = useState({});
  const [clean, setClean] = useState(false);
  
  console.log(`rendered...`);

  // * handles
  const handleChange = (e) => {
    setProductElement({ ...productElement, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: "" });
  }

  const validate = () => {
    let newErrors = {};

    if (!(productElement.id && productElement.name)) newErrors.name = "Ingrese el nombre del producto a buscar";
    if (!productElement.qty) newErrors.qty = "Ingrese la cantidad";
    
    setErrors(newErrors);
    
    return Object.keys(newErrors).length === 0; // Devuelve true si no hay errores
  }

  const updateSelectObject = (obj) => {
    // alert(`updateSelectObject: ${JSON.stringify(obj)}`);

    setProductElement({
      ...productElement,
      // key: uuidv4(),
      id: obj.id,
      name: obj.name,
      cost: obj.cost,
      unit: obj.unit,
      active: true
    });
    
  }

  // const handleButtonAdd = (productElement) => {
  //   // * validate
  //   if(!validate()) return;

  //   if(productElement.name === '') return;
  //   if(productElement.qty < 1) return;
    
  //   onNotifyUpdateTable(productElement, TableActionEnum.ADD);
  //   setProductElement(initProductElement);
  // }

  const handleButtonAdd = (productElement) => {
    // * validate
    if(!validate()) return;

    if(productElement.name === '') return;
    if(productElement.qty < 0) return;
    
    updateTableProductElement(productElement, TableActionEnum.ADD);
    setProductElement(initProductElement);
  }

  const cleanInput = () => {
    setProductElement(initProductElement);
  }

  // * return component
  return (
    
    <div className="d-flex gap-1 mb-2">

      <div className="col-9">
        <InputSearchWithTag 
          name="name"
          className={`form-control ${errors.name ? "is-invalid" : ""}`}
          searchField={"name"} 
          value={productElement.name}
          placeholder={"Buscador..."}
          onNotifyChangeEvent={handleChange}
          onSearchOptions={findElements}
          onNotifySelectOption={updateSelectObject}
          onNotifyRemoveTag={cleanInput}
        />
        {errors.name && <div className="custom-invalid-feedback">{errors.name}</div>}
      </div>

      <div className="col-2">
        <InputAmount 
          name={"qty"}
          className={`form-control ${errors.qty ? "is-invalid" : ""}`}
          value={productElement.qty}
          onChange={handleChange}
          placeholder={"Cantidad"}
        />
        {errors.qty && <div className="custom-invalid-feedback">{errors.qty}</div>}
      </div>
      
      <div className="col-1">
        <button 
          name='btnAddProductElement'
          className="btn btn-outline-success"            
          onClick={() => handleButtonAdd(productElement) }
        >
          {/* <img
            src={'src/common/assets/add-green.png'}
            style={{ width: "20px", height: "20px" }}
          /> */}
          +
        </button>
      </div>

    </div>
  )
}
