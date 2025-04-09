import { useEffect, useContext, useState } from 'react'

import { InputAmount, ButtonWithConfirm } from '../../../common/components';
import { TableActionEnum } from '../../../common/enums/table-actions.enum';

import { ProductsProductContext } from '../../context/ProductsProductContext';

export const ProductsProductElementTableItem = ({value = {}, selectedRow, onNotifyClick}) => {

  // * hooks
  const { updateTableProductElement } = useContext(ProductsProductContext);
  const [item, setItem] = useState({
    ...value
  });
  
  console.log(`rendered... item=${JSON.stringify(item)}`); 

  useEffect(() => {
    console.log(`rendered... value=${JSON.stringify(value)}`); 
    setItem({
      ...value
    });
  }, [value]);

  // * handles
  const handleChange = (e) => {
    const itemAux = {
      ...item,
      [e.target.name]: e.target.value
    }

    setItem(itemAux);
    updateTableProductElement(itemAux, TableActionEnum.UPDATE);
    // onNotifyUpdateTable(itemAux, TableActionEnum.UPDATE);
  }

  const handleButtonDelete = () => {
    const itemAux = {
      ...item,
      active: false
    }

    setItem(itemAux);
    updateTableProductElement(itemAux, TableActionEnum.DELETE);
    // onNotifyUpdateTable(itemAux, TableActionEnum.DELETE);
  }

  const handleRowClick = (item) => {
    onNotifyClick(item);
  }

  // * return component
  return (
    <tr 
      key={item.key} 
      onClick={() => handleRowClick(item)}
      className={selectedRow === item.key ? "table-dark" : ""}
      style={ item.active ?  { cursor: "pointer" } : { textDecoration: "line-through solid 1px red", color: "gray", opacity: 0.5, cursor: "pointer" } }
    >
      <td>
        { item.active
          ? <ButtonWithConfirm className={"btn btn-outline-danger btn-sm"}  title={"Confirmación"} message={"Eliminar item de la lista ¿Desea Continuar?"} onExecute={handleButtonDelete} imgPath={'src/common/assets/delete-red.png'} imgStyle={{ width: "15px", height: "15px" }}/>
          : <div/>
        }
      </td>

      <td className="text-capitalize">
        {item.name?.toLowerCase()}
      </td>

      <td>
        <InputAmount 
          name={"qty"} 
          className={"form-control form-control-sm"} 
          value={item.qty}
          // onChange={(event) => handleInputChange(event.target.name, event.target.value, item.price, item.discountPct)}
          onChange={handleChange}
          readOnly={!item.active}
        />
      </td>

      <td className="text-center">
        {item.unit}
      </td>

    </tr>
  )
}