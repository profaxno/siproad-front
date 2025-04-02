import React, { use, useEffect, useState } from 'react'
import { InputAmount } from '../../common/components/InputAmount';
import { ButtonWithConfirm } from "../../common/components/ButtonWithConfirm";
import '../../common/css/table.css';

export const SalesOrderTableItem = ({order = {}, onNotifyUpdateObject, onNotifySelectObject, onClick, selectedRow}) => {

  // * hooks
  const [item, setItem] = useState({
    ...order
  });

  console.log(`rendered... order=${JSON.stringify(item)}`);

  useEffect(() => {
    setItem({...order});
  }, [order]);

  // * handles
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
    console.log(`handleInputChange: notifying to saleOrder...`);
    onNotifyUpdateOrder(itemAux, 'update');
  }

  const handleButtonDelete = () => {
    const itemAux = {
      ...item,
      status: 0
    }

    setItem(itemAux);
    console.log(`handleButtonDelete: notifying to saleOrder...`);
    onNotifyUpdateObject(itemAux, 'delete');
  }

  const handleRowClick = (item) => {
    //setItem(item);
    onNotifySelectObject(item);
   
    console.log("Objeto seleccionado:", selectedRow, JSON.stringify(item));

    onClick(item); // Call the onClick function with the selected item
  }

  // * return component
  return (
    // <tr className="animate__animated animate__fadeInDown" key={order.id} style={ order.status === 0 ? { textDecoration: "line-through solid 1px red", color: "gray", opacity: 0.5 } : {} }>
    <tr 
      key={item.id} 
      onClick={() => handleRowClick(item)}
      className={selectedRow === item.id ? "table-dark" : ""} 
      style={ item.status === 0 ? { textDecoration: "line-through solid 1px red", color: "gray", opacity: 0.5, cursor: "pointer" } : { cursor: "pointer" } }
    >
      <td >
        { item.status === 1 
          ? <ButtonWithConfirm className={"btn btn-outline-danger btn-sm"} actionName={"x"} title={"Confirmar Acción"} message={"¿Desea Eliminar La Orden?"} onExecute={handleButtonDelete}/>
          : <div/>
        }
      </td>

      <td>
        {item.createdAt}
      </td>

      <td>
        {item.code}
      </td>

      <td className="text-capitalize">
        {item.customerName?.toLowerCase()}
      </td>

      <td className="text-first-uppercase">
        {item.comment?.toLowerCase()}
      </td>
    </tr>
  )
}