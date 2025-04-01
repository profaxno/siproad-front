import React, { useEffect, useState } from 'react'
import { InputAmount } from '../../common/components/InputAmount';
import { ButtonWithConfirm } from "../../common/components/ButtonWithConfirm";

export const SalesOrderProductTableItem = ({orderProduct = {}, onNotifyUpdateOrderProduct, onClick, selectedRow}) => {

  // * hooks
  const [item, setItem] = useState({
    ...orderProduct
  });
  
  console.log(`rendered... orderProduct=${JSON.stringify(item)}`);

  

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
    onNotifyUpdateOrderProduct(itemAux, 'update');
  }

  const handleButtonDelete = () => {
    const itemAux = {
      ...item,
      status: 0
    }

    setItem(itemAux);
    console.log(`handleButtonDelete: notifying to saleOrder...`);
    onNotifyUpdateOrderProduct(itemAux, 'delete');
  }

  const handleRowClick = (item) => {
    onClick(item); // Call the onClick function with the selected item
  }

  // * return component
  return (
    // <tr className="animate__animated animate__fadeInDown" key={orderProduct.id} style={ orderProduct.status === 0 ? { textDecoration: "line-through solid 1px red", color: "gray", opacity: 0.5 } : {} }>
    <tr 
      key={item.key} 
      onClick={() => handleRowClick(item)}
      className={selectedRow === item.key ? "table-dark" : ""}
      style={ item.status === 0 ? { textDecoration: "line-through solid 1px red", color: "gray", opacity: 0.5, cursor: "pointer" } : { cursor: "pointer" } }
    >
      <td>
        { item.status === 1 
          // ? <button className="btn btn-outline-danger" onClick={handleDeleteProduct}>x</button>
          ? <ButtonWithConfirm className={"btn btn-outline-danger btn-sm"} actionName={"-"} title={"Confirmar Acción"} message={"¿Desea Eliminar el Producto de la Lista?"} onExecute={handleButtonDelete}/>
          : <div/>
        }
      </td>

      <td>
        {item.code? item.code : ""}
      </td>

      <td className="text-capitalize">
        {item.name?.toLowerCase()}
      </td>

      <td>
        <InputAmount 
          name={"qty"} 
          className={"form-control form-control-sm"} 
          value={item.qty}
          onChange={(event) => handleInputChange(event.target.name, event.target.value, item.price, item.discountPct)}
        />
      </td>

      <td>
        <InputAmount 
          name={"price"} 
          className={"form-control form-control-sm"} 
          value={item.price}
          onChange={(event) => handleInputChange(event.target.name, item.qty, event.target.value, item.discountPct)}
        />
      </td>
      
      <td>
        <div className="d-flex align-items-center gap-1">
          <InputAmount 
            name={"discountPct"} 
            className={"form-control form-control-sm"} 
            value={item.discountPct}
            onChange={(event) => handleInputChange(event.target.name, item.qty, item.price,  event.target.value)}
            max={100}
          />
          %
        </div>
      </td>

      <td>
        <InputAmount className="form-control form-control-sm" value={item.subTotal} readOnly={true}/>
        {/* {item.subTotal} */}
      </td>
    </tr>
  )
}


{/* <div className="d-flex gap-2 mb-2">
                <input className="form-control w-70" style={{ flex: "70%" }} type="text" placeholder="Buscador de productos..."/>
                <input className="form-control w-20" style={{ flex: "20%" }} type="number" step="any" placeholder="Cantidad"/>
                <button className="btn btn-outline-primary w-10" style={{ flex: "10%" }}>+</button>
              </div> */}
