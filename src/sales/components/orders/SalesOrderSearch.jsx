import { useState, useEffect, useContext } from 'react'

import { SalesOrderContext } from '../../context/SalesOrderContext';
import { TableActionEnum } from '../../../common/enums/table-actions.enum';

export const SalesOrderSearch = () => {
  
  // * hooks
  const { updateTable, findOrders } = useContext(SalesOrderContext);
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

    const objListAux = await findOrders(value)
    updateTable(objListAux, TableActionEnum.LOAD);
  }

  // * return component
  return (
    <div className="d-flex gap-2 mb-2">

      <div className="col-6 flex-wrap">
        <label className="form-label text-end">Comentarios:</label>

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
