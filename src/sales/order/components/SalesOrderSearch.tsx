import type { FC } from "react";
import { ChangeEvent, useContext, useEffect } from 'react';

import { v4 as uuidv4 } from 'uuid';

import { TableActionEnum } from '../../../common/enums';

import { salesOrderContext } from '../context/sales-order.context';
import { FormSalesOrderDto, FormSalesOrderProductDto } from '../dto';
import { SalesOrderInterface, SalesOrderProductInterface } from '../interfaces';

export const SalesOrderSearch: FC = () => {

  // * hooks
  const context = useContext(salesOrderContext);
  if (!context) 
    throw new Error("SalesOrderSearch: salesOrderContext must be used within an SalesOrderProvider");

  const { formSearch, setFormSearch, searchOrders, updateTable, formatCode } = context;

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
      
      const formOrderList: FormSalesOrderDto[] = orderList.map( (order: SalesOrderInterface) => {
        
        const formOrderProductList: FormSalesOrderProductDto[] = order.productList.map( (orderProduct: SalesOrderProductInterface) => {
          
          // * calculate subTotal for each product in the list 
          const discount = orderProduct.qty * orderProduct.price * (orderProduct.discountPct / 100);
          const subTotal = orderProduct.qty * orderProduct.price - discount;
          const formOrderProduct = new FormSalesOrderProductDto(uuidv4(), orderProduct.id, orderProduct.qty, orderProduct.name, orderProduct.cost, orderProduct.price, orderProduct.discountPct, subTotal, orderProduct.status);
          return formOrderProduct;
        });
        
        const formattedCode = formatCode(order.code ?? 0);
        return new FormSalesOrderDto(order.customerName, order.status, formOrderProductList, formattedCode, order.customerIdDoc, order.customerEmail, order.customerPhone, order.customerAddress, order.comment, undefined, undefined, undefined, order.createdAt, order.id);

      });

      updateTable(TableActionEnum.LOAD, formOrderList);
    })
    .catch( (error) => {
      console.error('searchOrders: Error', error);
      updateTable(TableActionEnum.LOAD, []);
    });
  };

  // const search = () => {
  //   const createdAtInit     = formSearch.createdAtInit?.length     > 0 ? formSearch.createdAtInit     : undefined;
  //   const createdAtEnd      = formSearch.createdAtEnd?.length      > 0 ? formSearch.createdAtEnd      : undefined;
  //   const code              = formSearch.code?.length              > 3 ? formSearch.code              : undefined;
  //   const customerNameIdDoc = formSearch.customerNameIdDoc?.length > 3 ? formSearch.customerNameIdDoc : undefined;
  //   const comment           = formSearch.comment?.length           > 3 ? formSearch.comment           : undefined;

  //   if (!(createdAtInit || createdAtEnd || code || customerNameIdDoc || comment)) {
  //     updateTable(TableActionEnum.LOAD);
  //     return;
  //   }

  //   searchOrders(createdAtInit, createdAtEnd, code, customerNameIdDoc, comment)
  //   .then( (orderList: SalesOrderInterface[]) => {
      
  //     const formOrderList: FormSalesOrderDto[] = orderList.map( (order: SalesOrderInterface) => {
        
  //       const formOrderProductList: FormSalesOrderProductDto[] = order.productList.map( (orderProduct: SalesOrderProductInterface) => {
          
  //         // * calculate subTotal for each product in the list 
  //         const discount = orderProduct.qty * orderProduct.price * (orderProduct.discountPct / 100);
  //         const subTotal = orderProduct.qty * orderProduct.price - discount;
  //         const formOrderProduct ={
  //           key     : uuidv4(),
  //           id      : orderProduct.id,
  //           qty     : orderProduct.qty,
  //           comment : orderProduct.comment,
  //           name    : orderProduct.name,
  //           code    : orderProduct.code,
  //           cost    : orderProduct.cost,
  //           price   : orderProduct.price,
  //           discountPct: orderProduct.discountPct,
  //           subTotal: subTotal,
  //           status  : orderProduct.status
  //         };

  //         return formOrderProduct;
  //       });
        
  //       return {
  //         id            : order.id,
  //         code          : order.code,
  //         customerIdDoc : order.customerIdDoc,
  //         customerName  : order.customerName,
  //         customerEmail : order.customerEmail,
  //         customerPhone : order.customerPhone,
  //         customerAddress: order.customerAddress,
  //         comment       : order.comment,
  //         productList   : formOrderProductList,
  //         // subTotal: salesOrder.subTotal,
  //         // iva: salesOrder.iva,
  //         // total: salesOrder.total,
  //         createdAt     : order.createdAt,
  //         status        : order.status,
  //       };
  //     });

  //     updateTable(TableActionEnum.LOAD, formOrderList);
  //   })
  //   .catch( (error) => {
  //     console.error('searchOrders: Error', error);
  //     updateTable(TableActionEnum.LOAD, []);
  //   });
  // };

  // * return component
  return (
    <>
      <div className="d-flex gap-2 align-items-center">

        {/* <div className="col-6 col-sm flex-wrap">
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
        </div> */}

        {/* <div className="col-6 col-sm flex-wrap"> */}
          {/* <label className="form-label text-end">Busqueda:</label> */}
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
        {/* </div> */}

        {/* <div className="col-4 col-sm flex-wrap">
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
        </div> */}

      </div>

      <div className="mt-3">
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
    </>
  );
};
