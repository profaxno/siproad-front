import { useState, useEffect, useContext } from 'react'

import { ProductsProductContext } from '../../context/ProductsProductContext';
import { TableActionEnum } from '../../../common/enums/table-actions.enum';

export const ProductsProductSearch = () => {
  
  // * hooks
  const { objSearch, updateTable, searchProducts, setObjSearch } = useContext(ProductsProductContext);
  // const [inputValue, setInputValue] = useState();

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

  //   const objListAux = await findProducts(value)
  //   updateTable(objListAux, TableActionEnum.LOAD);
  // }

  const search = async() => {
    // alert(`search: ${JSON.stringify(objSearch)}`);

    const nameCode = objSearch.nameCode?.length > 3 ? objSearch.nameCode : undefined;
    const productTypeId = objSearch.productTypeId?.length > 0 ? objSearch.productTypeId : undefined;

    if(nameCode || productTypeId) {
      const objListAux = await searchProducts(nameCode, productTypeId);
      updateTable(objListAux, TableActionEnum.LOAD);
      return;
    }

    updateTable([], TableActionEnum.LOAD);
    return;
  }

  // * return component
  return (
    <div className="d-flex gap-2 mb-2">

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
  )
}
