import { useState, useEffect, useContext } from 'react'

import { ProductsProductContext } from '../../context/ProductsProductContext';
import { TableActionEnum } from '../../../common/enums/table-actions.enum';

export const ProductsProductSearch = () => {
  
  // * hooks
  const { objSearch, updateTable, searchProducts, setObjSearch, setScreenMessage } = useContext(ProductsProductContext);
  // const [inputValue, setInputValue] = useState();

  // console.log(`rendered...`);

  useEffect(() => {
    search();
  }, [objSearch]);

  // * handles
  const handleChange = (e) => {
    setObjSearch({ ...objSearch, [e.target.name]: e.target.value });
  }

  const search = () => {
    // alert(`search: ${JSON.stringify(objSearch)}`);

    const nameCode = objSearch.nameCode?.length > 3 ? objSearch.nameCode : undefined;
    const productTypeId = objSearch.productTypeId?.length > 0 ? objSearch.productTypeId : undefined;

    if( !(nameCode || productTypeId) ) {
      updateTable([], TableActionEnum.LOAD);
      return;
    }

    searchProducts(nameCode, productTypeId)
    .then( (objListAux) => updateTable(objListAux, TableActionEnum.LOAD) )
    .catch( (error) => {
      updateTable([], TableActionEnum.LOAD);
      setScreenMessage({type: "error", title: "Problema", message: 'No se completó la operación, intente de nuevo', show: true});
    });

    // const objListAux = await searchProducts(nameCode, productTypeId);
    // updateTable(objListAux, TableActionEnum.LOAD);
  }

  // * return component
  return (
    <div className="border rounded p-3 mb-2">

      <div className="d-flex gap-1 mb-2">

        <div className="col-6 flex-wrap">
          <label className="form-label text-end">Producto:</label>

          <input
            type="text"
            name="nameCode"
            className={"form-control"} 
            value={objSearch.nameCode}
            onChange={handleChange}
            // onKeyDown={handleKeyDown}
            placeholder={"Nombre o Código..."}
            autoComplete="off"
            maxLength={50}
          />
        </div>
        
      </div>
      
    </div>
  )
}
