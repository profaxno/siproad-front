import type { FC } from "react";
import { useEffect, useContext, useState, ChangeEvent } from 'react';

import { InputAmount, ButtonWithConfirm } from '../../../common/components';
import { TableActionEnum } from '../../../common/enums/table-actions.enum';

import { SalesOrderContext } from '../context/SalesOrderContext';
import { FormSalesOrderProductInterface } from '../interfaces';
import { SalesOrderProductStatusEnum } from '../enums/sales-order-product-status.enum';
import { SalesOrderStatusEnum } from "../enums/sales-order-status.enum";

interface Props {
  value: FormSalesOrderProductInterface;
  selectedRow: string;
  onNotifyClick: (formOrderProduct: FormSalesOrderProductInterface) => void;
}

export const SalesOrderProductTableItem: FC<Props> = ({
  value,
  selectedRow,
  onNotifyClick,
}) => {

  // * hooks
  const context = useContext(SalesOrderContext);
  if (!context) 
    throw new Error("SalesOrderProductTableItem: SalesOrderContext must be used within an SalesOrderProvider");
  
  const { form, updateTableOrderProduct } = context;
  const [formOrderProduct, setFormOrderProduct] = useState<FormSalesOrderProductInterface>({ ...value });
  const [isShowComment, setIsShowComment] = useState<boolean>(!!value.comment);

  useEffect(() => {
    setFormOrderProduct({ ...value });
  }, [value]);

  useEffect(() => {
    const amount = formOrderProduct.qty * formOrderProduct.price;
    const discount = amount * (formOrderProduct.discountPct / 100);
    const subTotal = amount - discount;

    const formOrderProductAux = {
      ...formOrderProduct,
      subTotal,
    };

    setFormOrderProduct(formOrderProductAux);
    updateTableOrderProduct(TableActionEnum.UPDATE, formOrderProductAux);
  }, [formOrderProduct.qty, formOrderProduct.price, formOrderProduct.discountPct, formOrderProduct.comment]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const valueAux = name === 'comment' ? value : parseFloat(value);
    const formOrderProductAux = { ...formOrderProduct, [name]: valueAux };
    setFormOrderProduct(formOrderProductAux);
  };

  const handleButtonDelete = () => {
    const formOrderProductAux = { 
      ...formOrderProduct, 
      status: SalesOrderProductStatusEnum.CANCELLED 
    };
    setFormOrderProduct(formOrderProductAux);
    updateTableOrderProduct(TableActionEnum.DELETE, formOrderProductAux);
  };

  const handleClick = () => onNotifyClick(formOrderProduct);

  const handleButtonShowComment = (show: boolean) => {
    if (!show) {
      const formOrderProductAux = { ...formOrderProduct, comment: undefined };
      setFormOrderProduct(formOrderProductAux);
      updateTableOrderProduct(TableActionEnum.UPDATE, formOrderProductAux);
    }

    setIsShowComment(!isShowComment);
  };

  return (
    <>
      <tr
        key={formOrderProduct.key}
        onClick={handleClick}
        className={selectedRow === formOrderProduct.key ? 'custom-table-select' : ''}
        style={
          formOrderProduct.status === SalesOrderProductStatusEnum.CANCELLED
          ? {
              textDecoration: 'line-through solid 1px red',
              color: 'gray',
              opacity: 0.5,
              cursor: 'pointer',
            }
          : { cursor: 'pointer' }
        }
      >
        <td>
          {
            form.status === SalesOrderStatusEnum.CANCELLED || formOrderProduct.status === SalesOrderProductStatusEnum.CANCELLED
            ? ( <div/> ) 
            : (
                <div className="d-flex gap-1">
                  <ButtonWithConfirm
                    className="custom-btn-outline-danger-delete-sm"
                    title="Confirmación"
                    message="Eliminar producto de la lista ¿Desea Continuar?"
                    onExecute={handleButtonDelete}
                  />
                  <button
                    className="custom-btn-outline-success-edit-sm"
                    onClick={() => handleButtonShowComment(!isShowComment)}
                  />
                </div>
              )
          }
        </td>

        <td>{formOrderProduct.code ?? ''}</td>

        <td className="text-capitalize">{formOrderProduct.name?.toLowerCase()}</td>

        <td>
          <InputAmount
            name="qty"
            className="form-control form-control-sm"
            value={formOrderProduct.qty}
            onChange={handleChange}
            readOnly={form.status === SalesOrderStatusEnum.CANCELLED || formOrderProduct.status === SalesOrderProductStatusEnum.CANCELLED}
          />
        </td>

        <td>
          <InputAmount
            name="price"
            className="form-control form-control-sm"
            value={formOrderProduct.price}
            onChange={handleChange}
            readOnly={form.status === SalesOrderStatusEnum.CANCELLED || formOrderProduct.status === SalesOrderProductStatusEnum.CANCELLED}
          />
        </td>

        <td>
          <div className="d-flex align-items-center gap-1">
            <InputAmount
              name="discountPct"
              className="form-control form-control-sm"
              value={formOrderProduct.discountPct}
              onChange={handleChange}
              max={100}
              readOnly={form.status === SalesOrderStatusEnum.CANCELLED || formOrderProduct.status === SalesOrderProductStatusEnum.CANCELLED}
            />
            %
          </div>
        </td>

        <td>
          <InputAmount
            className="form-control form-control-sm"
            value={formOrderProduct.subTotal}
            readOnly={true}
          />
        </td>
      </tr>

      {isShowComment && (
        <tr
          className={selectedRow === formOrderProduct.key ? 'custom-table-select' : ''}
          style={
            formOrderProduct.status === SalesOrderProductStatusEnum.CANCELLED
              ? {
                  textDecoration: 'line-through solid 1px red',
                  color: 'gray',
                  opacity: 0.5,
                  cursor: 'pointer',
                }
              : { cursor: 'pointer' }
          }
        >
          <td colSpan={7}>
            <input
              type="text"
              name="comment"
              className="form-control form-control-sm"
              value={formOrderProduct.comment ?? ''}
              placeholder="Comentario..."
              onChange={handleChange}
              maxLength={100}
              readOnly={form.status === SalesOrderStatusEnum.CANCELLED || formOrderProduct.status === SalesOrderProductStatusEnum.CANCELLED}
            />
          </td>
        </tr>
      )}
    </>
  );
};
