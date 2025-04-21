import { useEffect, useContext, useState } from 'react'

import { InputAmount, ButtonWithConfirm } from '../../../common/components';
import { TableActionEnum } from '../../../common/enums/table-actions.enum';

import { SalesOrderContext } from '../../context/SalesOrderContext';

export const SalesOrderProductTableItem = ({value = {}, selectedRow, onNotifyClick}) => {

  // * hooks
  const { updateTableOrderProduct } = useContext(SalesOrderContext);
  const [item, setItem] = useState({...value});
  const [isShowComment, setIsShowComment] = useState(item.comment ? true : false);

  // console.log(`rendered... item=${JSON.stringify(item)}`); 

  useEffect(() => {
    // console.log(`rendered... value=${JSON.stringify(value)}`); 
    setItem({...value});
  }, [value]);
  

  useEffect(() => {
    // * calculate subtotal
    const amount = item.qty * item.price;
    const discount = amount * (item.discountPct / 100);
    const subTotal = amount - discount;
    
    const itemAux = {
      ...item,
      subTotal
    }

    setItem(itemAux);
    updateTableOrderProduct(itemAux, TableActionEnum.UPDATE);

  }, [item.qty, item.price, item.discountPct, item.comment]);

  // * handles
  const handleChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  }

  // const handleInputChange = (fieldName, qty, price, discountPct, comment) => {
    
  //   qty = parseFloat(qty);
  //   price = parseFloat(price);
  //   discountPct = parseFloat(discountPct);
    
  //   alert(`fieldName=${fieldName} qty=${qty} price=${price} discountPct=${discountPct} comment=${comment}`);

  //   // validate discountPct value (min 0 and max 100)
  //   if(fieldName === 'discountPct' && (discountPct < 0 || discountPct > 100) ) 
  //     return;

  //   // * calculate subtotal
  //   const discount = (qty * price) * (discountPct / 100);
  //   const subTotal = (qty * price) - discount;

    

  //   const itemAux = {
  //     ...item,
  //     qty, 
  //     price, 
  //     discountPct,
  //     subTotal,
  //     comment
  //   }

  //   setItem(itemAux);
  //   updateTableOrderProduct(itemAux, TableActionEnum.UPDATE);
  // }

  const handleButtonDelete = () => {
    const itemAux = {
      ...item,
      status: 0
      // active: false
    }

    setItem(itemAux);
    updateTableOrderProduct(itemAux, TableActionEnum.DELETE);
  }

  const handleRowClick = (item) => {
    onNotifyClick(item);
  }

  const handleButtonShowComment = (isShoww) => {
    if(!isShoww) {
      const itemAux = {...item, comment: undefined}
      setItem(itemAux);
      updateTableOrderProduct(itemAux, TableActionEnum.UPDATE);
    }

    setIsShowComment(!isShowComment);
  }


  // * return component
  return (
    <>
      <tr 
        key={item.key} 
        onClick={() => handleRowClick(item)}
        className={selectedRow === item.key ? "custom-table-select" : ""}
        style={ item.status === 0 ? { textDecoration: "line-through solid 1px red", color: "gray", opacity: 0.5, cursor: "pointer" } : { cursor: "pointer" } }
      >
        <td>
          { item.status === 0 
            ? <div/>
            : 
              <div className='d-flex gap-1'>
                <ButtonWithConfirm className={"custom-btn-outline-danger-delete-sm"}  title={"Confirmación"} message={"Eliminar item de la lista ¿Desea Continuar?"} onExecute={handleButtonDelete} />
                <button className={"custom-btn-outline-success-edit-sm"}  onClick={() => handleButtonShowComment(!isShowComment)} />
              </div>
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
            // onChange={(event) => handleInputChange(event.target.name, event.target.value, item.price, item.discountPct, item.comment)}
            onChange={handleChange}
            readOnly={item.status === 0}
          />
        </td>

        <td>
          <InputAmount 
            name={"price"} 
            className={"form-control form-control-sm"} 
            value={item.price}
            // onChange={(event) => handleInputChange(event.target.name, item.qty, event.target.value, item.discountPct, item.comment)}
            onChange={handleChange}
            readOnly={item.status === 0}
          />
        </td>
        
        <td>
          <div className="d-flex align-items-center gap-1">
            <InputAmount 
              name={"discountPct"} 
              className={"form-control form-control-sm"} 
              value={item.discountPct}
              max={100}
              // onChange={(event) => handleInputChange(event.target.name, item.qty, item.price, event.target.value, item.comment)}
              onChange={handleChange}
              readOnly={item.status === 0}
            />
            %
          </div>
        </td>

        <td>
          <InputAmount className="form-control form-control-sm" value={item.subTotal} readOnly={true}/>
        </td>

      </tr>

      { (isShowComment) &&
        <tr 
          className={selectedRow === item.key ? "custom-table-select" : ""}
          style={ item.status === 0 ? { textDecoration: "line-through solid 1px red", color: "gray", opacity: 0.5, cursor: "pointer" } : { cursor: "pointer" } }
        >
          <td colSpan={7}>
            <input
              type="text"
              name="comment"
              className="form-control form-control-sm"
              value={item.comment?.toLowerCase()}
              placeholder={"Comentario..."}
              // onChange={(event) => handleInputChange(event.target.name, item.qty, item.price, item.discountPct, event.target.value)}
              onChange={handleChange}
              maxLength={100}
            />
          </td>
        </tr>
      }
    </>
  )
}