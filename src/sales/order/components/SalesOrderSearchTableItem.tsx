import type { FC } from "react";
import { useContext } from 'react';

import { salesOrderContext } from '../context/sales-order.context';
import { FormSalesOrderDto } from '../dto';
import { SalesOrderStatusEnum, SalesOrderStatusNameEnum } from '../enums';

interface Props {
  value: FormSalesOrderDto;
}

export const SalesOrderSearchTableItem: FC<Props> = ({ value }) => {

  // * hooks
  const context = useContext(salesOrderContext);
  if (!context) 
    throw new Error("SalesOrderSearchTableItem: salesOrderContext must be used within an SalesOrderProvider");

  const { form, setIsOpenOrderSection, updateForm } = context;
  
  // * handles
  const handleClick = () => {
    updateForm(value);
    setIsOpenOrderSection(true);
  }

  // const handleRowClick = () => {

  //   // * calculate subTotal for each product in the list
  //   const formProductList: FormSalesOrderProductInterface[] = value.productList.map((value) => {
  //     const discount = value.qty * value.price * (value.discountPct / 100);
  //     const subTotal = value.qty * value.price - discount;

  //     return {
  //       ...value,
  //       subTotal,
  //     };
  //   });

  //   const formAux: FormSalesOrderInterface = {
  //     ...value,
  //     productList: formProductList,
  //   };

  //   updateForm(formAux);
  // };

  // * return component
  
  return (
    <tr
      key={value.id}
      onClick={handleClick}
      className={form.id === value.id ? 'custom-table-select' : ''}
      style={
        value.status === SalesOrderStatusEnum.CANCELLED
          ? {
              textDecoration: 'line-through solid 1px red',
              color: 'gray',
              opacity: 0.5,
              cursor: 'pointer',
            }
          : { cursor: 'pointer' }
      }
    >
      <td>{value.createdAt}</td>
      <td>{value.code ?? ''}</td>
      <td className="text-capitalize">{value.customerName?.toLowerCase() ?? ''}</td>
      <td>{value.comment ?? ''}</td>
      {/* <td className="text-first-uppercase">{value.comment?.toLowerCase()}</td> */}
      <td>{Object.values(SalesOrderStatusNameEnum)[value.status]}</td>
    </tr>
  );
};
