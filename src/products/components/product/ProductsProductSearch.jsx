import { useState, useEffect, useContext } from 'react'

import { ProductsProductContext } from '../../context/ProductsProductContext';
import { TableActionEnum } from '../../../common/enums/table-actions.enum';

export const ProductsProductSearch = () => {
  
  // * hooks
  const { updateTable, findProducts } = useContext(ProductsProductContext);
  const [inputValue, setInputValue] = useState();

  console.log(`rendered...`);

  // * handles
  const handleInputChange = async(e) => {
    const value = e.target.value;
    console.log(`handleInputChange: value=${value}`);
    setInputValue(value);

    if(value.length < 3) {
      updateTable([], TableActionEnum.LOAD);
      return;
    }

    const objListAux = await findProducts(value)
    updateTable(objListAux, TableActionEnum.LOAD);
  }

  // * return component
  return (
    <div className="d-flex gap-2 mb-2">

      <div className="col-6 flex-wrap">
        <label className="form-label text-end">Nombre:</label>

        <input
          name="comment"
          type="text"
          className={"form-control"} 
          value={inputValue}
          onChange={handleInputChange}
          // onKeyDown={handleKeyDown}
          placeholder={"Buscador..."}
          autoComplete="off"
        />
      </div>
      
    </div>
  )
}
