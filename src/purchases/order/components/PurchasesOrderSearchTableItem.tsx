import type { FC } from "react";
import { useContext } from 'react';

import { purchasesOrderContext } from '../context/purchases-order.context';
import { FormPurchasesOrderDto } from '../dto';
import { PurchasesOrderStatusEnum/*, PurchasesOrderStatusNameEnum*/ } from '../enums/purchases-order-status.enum';
import { InputAmount } from "../../../common/components";

interface Props {
  value: FormPurchasesOrderDto;
}

export const PurchasesOrderSearchTableItem: FC<Props> = ({ value }) => {

  // * hooks
  const context = useContext(purchasesOrderContext);
  if (!context) 
    throw new Error("PurchasesOrderSearchTableItem: PurchasesOrderContext must be used within an PurchasesOrderProvider");

  const { form, setIsOpenFormSection, updateForm } = context;
  
  // * handles
  const handleClick = () => {
    updateForm(value);
    setIsOpenFormSection(true);
  }

  // const handleRowClick = () => {

  //   // * calculate subTotal for each product in the list
  //   const formProductList: FormPurchasesOrderProductInterface[] = value.productList.map((value) => {
  //     const discount = value.qty * value.price * (value.discountPct / 100);
  //     const subTotal = value.qty * value.price - discount;

  //     return {
  //       ...value,
  //       subTotal,
  //     };
  //   });

  //   const formAux: FormPurchasesOrderDto = {
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
        value.status === PurchasesOrderStatusEnum.CANCELLED
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
      <td className="text-capitalize">{value.providerName?.toLowerCase() ?? ''}</td>
      <td>
        <InputAmount
          name="amount"
          className="form-control form-control-sm"
          value={value.amount ?? 0}
          readOnly={true}
        />
      </td>
      <td>{value.comment ?? ''}</td>
      {/* <td className="text-first-uppercase">{value.comment?.toLowerCase()}</td> */}
      {/* <td>{Object.values(PurchasesOrderStatusNameEnum)[value.status]}</td> */}
    </tr>
  );
};
