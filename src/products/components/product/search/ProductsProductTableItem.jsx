import React, { useState, useEffect, useContext  } from 'react'

// import { v4 as uuidv4 } from 'uuid';

import '../../../../common/css/table.css';
import { ProductsProductContext } from '../../../context/ProductsProductContext';
import { ButtonWithConfirm } from "../../../../common/components/ButtonWithConfirm";
import { InputAmount } from '../../../../common/components/InputAmount';
import { TableActionEnum } from '../../../enums/table-actions.enum';

export const ProductsProductTableItem = ({value = {}}) => {

  // * hooks
  const { obj, updateTable, updateForm, calculateProfitMargin, updateTableProductElement, cleanForm, setShowMessage } = useContext(ProductsProductContext);
  const [item, setItem] = useState({...value});
  
  console.log(`rendered... item=${JSON.stringify(value)}`);

  useEffect(() => {
    console.log(`rendered... useEffect item=${JSON.stringify(value)}`);
    setItem({...value});
  }, [value]);

  // * handles
  const handleRowClick = () => {
    // alert(`handleRowClick: item=${JSON.stringify(item)}`);
    
    const elementListAux = item.elementList.map((value) => {
      return {
        ...value,
        // key: uuidv4(),
        active: true
      }
    });

    const itemAux = {
      ...item,
      elementList: elementListAux
    }

    // alert(`handleRowClick: itemAux=${JSON.stringify(elementListAux)}`);
    updateForm(itemAux);
    updateTableProductElement(elementListAux, TableActionEnum.LOAD);
  }

  // const handleButtonDelete = () => {
  //   const itemAux = {
  //     ...item,
  //     active: false
  //   }

  //   cleanForm();
  //   updateTable(itemAux, TableActionEnum.DELETE);
  //   setShowMessage(true);
  //   // setItem(itemAux);
  // }

  // * return component
  return (
    <tr 
      key={item.key} 
      onClick={() => handleRowClick()}
      className={obj.key === item.key ? "table-dark" : ""} 
      style={ item.active ? { cursor: "pointer" } : { textDecoration: "line-through 1px red ", cursor: "pointer" } }
    >
      {/* <td >
        { item.active
          ? <ButtonWithConfirm className={"btn btn-outline-danger btn-sm"} actionName={"x"} title={"Confirmación"} message={"Eliminar la Orden ¿Desea Continuar?"} onExecute={handleButtonDelete}/>
          : <div/>
        }
      </td> */}

      <td>
        {item.code}
      </td>

      <td className="text-capitalize">
        {item.name?.toLowerCase()}
      </td>

      <td>
        <InputAmount className="form-control form-control-sm" value={item.cost} readOnly={true}/>
      </td>

      <td>
        <InputAmount className="form-control form-control-sm" value={item.price} readOnly={true}/>
      </td>

      <td>
        <div className="d-flex align-items-center gap-1">
          <InputAmount className="form-control form-control-sm" value={calculateProfitMargin(item)} readOnly={true}/>
          %
        </div>
      </td>
    </tr>
  )
}