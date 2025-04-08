import { useEffect, useContext, useState } from 'react'

import { ProductsProductContext } from '../../../context/ProductsProductContext';
import { InputAmount } from '../../../../common/components/InputAmount';
import { TableActionEnum } from '../../../enums/table-actions.enum';
import { ButtonWithConfirm } from '../../../../common/components/ButtonWithConfirm';

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

  const handleInputChange = (fieldName, qty, price, discountPct) => {     

    // validate discountPct value (min 0 and max 100)
    if(fieldName === 'discountPct' && (discountPct < 0 || discountPct > 100) ) return;

    // calcutale discount
    const discount = (qty * price) * (discountPct / 100);

    // calculate subTotal
    const subTotal = (qty * price) - discount;

    const itemAux = {
      ...item,
      qty, 
      price, 
      discountPct,
      subTotal
    }

    setItem(itemAux);
    onNotifyUpdateTable(itemAux, TableActionEnum.UPDATE);
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
          ? <ButtonWithConfirm className={"btn btn-outline-danger btn-sm"} actionName={"x"} title={"Confirmación"} message={"Eliminar producto de la lista ¿Desea Continuar?"} onExecute={handleButtonDelete}/>
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