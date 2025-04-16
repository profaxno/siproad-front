import { useState, useEffect, useContext, use } from 'react'

import { SalesOrderContext } from '../../context/SalesOrderContext';
import { TableActionEnum } from '../../../common/enums/table-actions.enum';



export const SalesOrderSearch = () => {
  
  // * hooks
  const { objSearch, updateTable, searchOrders, setObjSearch, setScreenMessage } = useContext(SalesOrderContext);
  
  // console.log(`rendered...`);

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

    const createdAtInit     = objSearch.createdAtInit?.length     > 0 ? objSearch.createdAtInit     : undefined;
    const createdAtEnd      = objSearch.createdAtEnd?.length      > 0 ? objSearch.createdAtEnd      : undefined;
    const code              = objSearch.code?.length              > 3 ? objSearch.code              : undefined;
    const customerNameIdDoc = objSearch.customerNameIdDoc?.length > 3 ? objSearch.customerNameIdDoc : undefined;
    const comment           = objSearch.comment?.length           > 3 ? objSearch.comment           : undefined;

    // alert(`search: createdAtInit=${createdAtInit}, createdAtEnd=${createdAtEnd}, code=${code}, customerNameIdDoc=${customerNameIdDoc}, comment=${comment}`);	

    if( !(createdAtInit || createdAtEnd || code || customerNameIdDoc || comment) ) {
      updateTable([], TableActionEnum.LOAD);
      return;
    }

    
    searchOrders(createdAtInit, createdAtEnd, code, customerNameIdDoc, comment)
    .then( (objListAux) => updateTable(objListAux, TableActionEnum.LOAD) )
    .catch( (error) => {
      updateTable([], TableActionEnum.LOAD);
      setScreenMessage({type: "error", title: "Problema", message: 'No se completó la operación, intente de nuevo', show: true});
    });

    // const objListAux = await searchOrders(createdAtInit, createdAtEnd, code, customerNameIdDoc, comment);
    // updateTable(objListAux, TableActionEnum.LOAD);
  }

  // * return component
  return (
    <div className="border rounded p-3 mb-2">

      <div className="d-flex gap-1 mb-2">

        <div className="col-4 col-sm flex-wrap">
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

        <div className="col-4 col-sm flex-wrap">
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

        <div className="col-4 col-sm flex-wrap">
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

      <div>
        <label className="form-label text-end">Rango Creación:</label>
        
        <div className='d-flex gap-1'>
          <div className="col-6 col-sm">
            <input
              type="date"
              name="createdAtInit"
              className={"form-control"}
              value={objSearch.createdAtInit}
              onChange={handleChange}
              // onKeyDown={handleKeyDown}
              // placeholder={"Buscador..."}
              // autoComplete="off"
              // maxLength={50}
            />
          </div>

          <div className="col-6 col-sm">
            <input
              type="date"
              name="createdAtEnd"
              className={"form-control"} 
              value={objSearch.createdAtEnd}
              onChange={handleChange}
              // onKeyDown={handleKeyDown}
              // placeholder={"Buscador..."}
              // autoComplete="off"
              // maxLength={50}
            />
          </div>
        </div>
      </div>

    </div>
  )
}
