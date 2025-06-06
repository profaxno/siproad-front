import type { FC } from "react";
import { ChangeEvent, useContext, useEffect } from 'react';

import { v4 as uuidv4 } from 'uuid';

import { SalesOrderContext } from '../context/SalesOrderContext';
import { TableActionEnum } from '../../../common/enums/table-actions.enum';
import { FormSalesOrderInterface, FormSalesOrderProductInterface, SalesOrderInterface } from '../interfaces';

// import { ScreenMessageTypeEnum } from '../../../common/enums/screen-message-type-enum';
import { SalesOrderProductInterface } from '../interfaces/sales-order.interface';

export const SalesOrderSearch: FC = () => {

  // * hooks
  const context = useContext(SalesOrderContext);
  if (!context) 
    throw new Error("SalesOrderSearch: SalesOrderContext must be used within an SalesOrderProvider");

  const { formSearch, setFormSearch, searchOrders, updateTable } = context;

  useEffect(() => {
    search();
  }, [formSearch]);

  // * handles
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormSearch({ ...formSearch, [name]: value });
  };

  const search = () => {
    const createdAtInit     = formSearch.createdAtInit?.length     > 0 ? formSearch.createdAtInit     : undefined;
    const createdAtEnd      = formSearch.createdAtEnd?.length      > 0 ? formSearch.createdAtEnd      : undefined;
    const code              = formSearch.code?.length              > 3 ? formSearch.code              : undefined;
    const customerNameIdDoc = formSearch.customerNameIdDoc?.length > 3 ? formSearch.customerNameIdDoc : undefined;
    const comment           = formSearch.comment?.length           > 3 ? formSearch.comment           : undefined;

    if (!(createdAtInit || createdAtEnd || code || customerNameIdDoc || comment)) {
      updateTable(TableActionEnum.LOAD);
      return;
    }

    searchOrders(createdAtInit, createdAtEnd, code, customerNameIdDoc, comment)
    .then( (orderList: SalesOrderInterface[]) => {
      
      const formOrderList: FormSalesOrderInterface[] = orderList.map( (salesOrder: SalesOrderInterface) => {
        
        const formOrderProductList: FormSalesOrderProductInterface[] = salesOrder.productList.map( (orderProduct: SalesOrderProductInterface) => {
          
          // * calculate subTotal for each product in the list 
          const discount = orderProduct.qty * orderProduct.price * (orderProduct.discountPct / 100);
          const subTotal = orderProduct.qty * orderProduct.price - discount;
          const formOrderProduct ={
            key     : uuidv4(),
            id      : orderProduct.id,
            qty     : orderProduct.qty,
            comment : orderProduct.comment,
            name    : orderProduct.name,
            code    : orderProduct.code,
            cost    : orderProduct.cost,
            price   : orderProduct.price,
            discountPct: orderProduct.discountPct,
            subTotal: subTotal,
            status  : orderProduct.status
          };

          return formOrderProduct;
        });
        
        return {
          id            : salesOrder.id,
          code          : salesOrder.code,
          customerIdDoc : salesOrder.customerIdDoc,
          customerName  : salesOrder.customerName,
          customerEmail : salesOrder.customerEmail,
          customerPhone : salesOrder.customerPhone,
          customerAddress: salesOrder.customerAddress,
          comment       : salesOrder.comment,
          productList   : formOrderProductList,
          // subTotal: salesOrder.subTotal,
          // iva: salesOrder.iva,
          // total: salesOrder.total,
          createdAt     : salesOrder.createdAt,
          status        : salesOrder.status,
        };
      });

      updateTable(TableActionEnum.LOAD, formOrderList);
    })
    .catch( (error) => {
      console.error('searchOrders: Error', error);
      updateTable(TableActionEnum.LOAD, []);
    });
  };

  // * return component
  return (
    <div className="border rounded p-3 mb-2">
      <div className="d-flex gap-1 mb-2">
        <div className="col-4 col-sm flex-wrap">
          <label className="form-label text-end">Código:</label>
          <input
            type="text"
            name="code"
            className="form-control"
            value={formSearch.code}
            onChange={handleChange}
            autoComplete="off"
            maxLength={50}
          />
        </div>

        <div className="col-4 col-sm flex-wrap">
          <label className="form-label text-end">Cliente:</label>
          <input
            type="text"
            name="customerNameIdDoc"
            className="form-control"
            value={formSearch.customerNameIdDoc}
            onChange={handleChange}
            placeholder="Nombre o RUT..."
            autoComplete="off"
            maxLength={50}
          />
        </div>

        <div className="col-4 col-sm flex-wrap">
          <label className="form-label text-end">Comentarios:</label>
          <input
            type="text"
            name="comment"
            className="form-control"
            value={formSearch.comment}
            onChange={handleChange}
            autoComplete="off"
            maxLength={100}
          />
        </div>
      </div>

      <div>
        <label className="form-label text-end">Rango Creación:</label>
        <div className="d-flex gap-1">
          <div className="col-6 col-sm">
            <input
              type="date"
              name="createdAtInit"
              className="form-control"
              value={formSearch.createdAtInit}
              onChange={handleChange}
            />
          </div>

          <div className="col-6 col-sm">
            <input
              type="date"
              name="createdAtEnd"
              className="form-control"
              value={formSearch.createdAtEnd}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
