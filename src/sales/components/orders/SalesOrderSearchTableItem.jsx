import React, { useState, useEffect, useContext  } from 'react'

import '../../../common/css/table.css';
import { InputAmount } from '../../../common/components/InputAmount';
import { TableActionEnum } from '../../../common/enums/table-actions.enum';

import { SalesOrderContext } from '../../context/SalesOrderContext';

export const SalesOrderSearchTableItem = ({value = {}}) => {

  // * hooks
  const { obj, cleanForm, updateForm, updateTableOrderProduct } = useContext(SalesOrderContext);
  const [item, setItem] = useState({...value});
  
  // console.log(`rendered... item=${JSON.stringify(value)}`);

  useEffect(() => {
    // console.log(`rendered... useEffect item=${JSON.stringify(value)}`);
    setItem({...value});
  }, [value]);

  // * handles
  const handleRowClick = () => {
        
    const productListAux = item.productList.map((value) => {
      
      const discount = (value.qty * value.price) * (value.discountPct / 100);
      const subTotal = (value.qty * value.price) - discount;

      return {
        ...value,
        subTotal,
        // active: true
      }
    });

    const itemAux = {
      ...item,
      productList: productListAux
    }

    cleanForm();
    updateForm(itemAux);
    updateTableOrderProduct(productListAux, TableActionEnum.LOAD);
  }

  // * return component
  return (
    <tr 
      key={item.key} 
      onClick={() => handleRowClick()}
      className={obj.key === item.key ? "custom-table-select" : ""} 
      style={ item.status === 0 ? { textDecoration: "line-through solid 1px red", color: "gray", opacity: 0.5, cursor: "pointer" } : { cursor: "pointer" } }
    >
      <td>
        {item.createdAt}
      </td>

      <td>
        {item.code? item.code : ""}
      </td>

      <td className="text-capitalize">
        {item.customerName ? item.customerName.toLowerCase() : ""}
      </td>

      <td className="text-first-uppercase">
        {item.comment ? item.comment.toLowerCase() : ""}
      </td>
    </tr>
  )
}