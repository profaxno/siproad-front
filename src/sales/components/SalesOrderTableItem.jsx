import React, { use, useEffect, useState } from 'react'
import { InputAmount } from '../../common/components/InputAmount';
import { ButtonWithConfirm } from "../../common/components/ButtonWithConfirm";
import '../../common/css/table.css';

export const SalesOrderTableItem = ({order = {}, onNotifyUpdateObject, onNotifySelectObject, onClick, selectedRow}) => {

  // * hooks
  const [item, setItem] = useState({
    ...order
  });

  console.log(`rendered...`);

  useEffect(() => {
    console.log(`rendered... useEffect`);
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
    onNotifyUpdateOrder(itemAux, 'update');
  }

  const handleButtonDelete = () => {
    const itemAux = {
      ...item,
      status: 0
    }

    setItem(itemAux);
    onNotifyUpdateObject(itemAux, 'delete');
  }

  const handleRowClick = (item) => {
    
    onNotifySelectObject(item);
    onClick(item);
  }

  // * return component
  return (
    // <tr className="animate__animated animate__fadeInDown" key={order.id} style={ order.status === 0 ? { textDecoration: "line-through solid 1px red", color: "gray", opacity: 0.5 } : {} }>
    
    // <tr 
    //   key={item.id} 
    //   onClick={() => handleRowClick(item)}
    //   className={`${selectedRow === item.id ? "table-dark selected" : ""} ${item.status === 0 ? "strikethrough" : ""}`} 
    // >

    <tr 
      key={item.id} 
      onClick={() => handleRowClick(item)}
      className={selectedRow === item.id ? "table-dark" : ""} 
      style={ item.status === 0 ? { textDecoration: "line-through 1px red ", cursor: "pointer" } : { cursor: "pointer" } }
    >
      <td >
        { item.status === 1 
          ? <ButtonWithConfirm className={"btn btn-outline-danger btn-sm"} actionName={"x"} title={"Confirmación"} message={"Eliminar la Orden ¿Desea Continuar?"} onExecute={handleButtonDelete}/>
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