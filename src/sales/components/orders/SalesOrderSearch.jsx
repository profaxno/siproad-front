import { useState, useEffect, useContext, use } from 'react'

import { SalesOrderContext } from '../../context/SalesOrderContext';
import { TableActionEnum } from '../../../common/enums/table-actions.enum';



export const SalesOrderSearch = () => {
  
  // * hooks
  const { objSearch, updateTable, searchOrders, setObjSearch } = useContext(SalesOrderContext);
  
  console.log(`rendered...`);

  useEffect(() => {
    search();
  }, [objSearch]);

  // * handles
  const handleChange = (e) => {
    setObjSearch({ ...objSearch, [e.target.name]: e.target.value });
  }

  // const handleInputChange = async(e) => {
  //   const value = e.target.value;
  //   console.log(`handleInputChange: value=${value}`);
  //   setInputValue(value);

  //   if(value.length < 3) {
  //     updateTable([], TableActionEnum.LOAD);
  //     return;
  //   }

  //   const objListAux = await searchOrders(value)
  //   updateTable(objListAux, TableActionEnum.LOAD);
  // }

  const search = async() => {
    // alert(`search: ${JSON.stringify(objSearch)}`);

    const code              = objSearch.code?.length              > 3 ? objSearch.code : undefined;
    const customerNameIdDoc = objSearch.customerNameIdDoc?.length > 3 ? objSearch.customerNameIdDoc : undefined;
    const comment           = objSearch.comment?.length           > 3 ? objSearch.comment : undefined;

    if(code || customerNameIdDoc || comment) {
      const objListAux = await searchOrders(code, customerNameIdDoc, comment);
      updateTable(objListAux, TableActionEnum.LOAD);
      return;
    }

    updateTable([], TableActionEnum.LOAD);
    return;
  }

  // * return component
  return (
    <div className="d-flex gap-2 mb-2">

      <div className="col-3 flex-wrap">
        <label className="form-label text-end">Código:</label>

        <input
          type="text"
          name="code"
          className={"form-control"} 
          value={objSearch.code}
          onChange={handleChange}
          // onKeyDown={handleKeyDown}
          // placeholder={"Buscador..."}
          autoComplete="off"
          maxLength={50}
        />
      </div>

      <div className="col-4 flex-wrap">
        <label className="form-label text-end">Cliente:</label>

        <input
          type="text"
          name="customerNameIdDoc"
          className={"form-control"} 
          value={objSearch.customerNameIdDoc}
          onChange={handleChange}
          // onKeyDown={handleKeyDown}
          placeholder={"Nombre o RUT..."}
          autoComplete="off"
          maxLength={50}
        />
      </div>

      <div className="col-4 flex-wrap">
        <label className="form-label text-end">Comentarios:</label>

        <input
          type="text"
          name="comment"
          className={"form-control"} 
          value={objSearch.comment}
          onChange={handleChange}
          // onKeyDown={handleKeyDown}
          // placeholder={"Buscador..."}
          autoComplete="off"
          maxLength={100}
        />
      </div>
      
    </div>
  )
}
