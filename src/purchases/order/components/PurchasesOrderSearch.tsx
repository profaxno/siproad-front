import type { FC } from "react";
import { ChangeEvent, useContext, useEffect } from 'react';

import { v4 as uuidv4 } from 'uuid';

import { purchasesOrderContext } from '../context/purchases-order.context';
import { TableActionEnum } from '../../../common/enums/table-actions.enum';
import { FormPurchasesOrderDto, FormPurchasesOrderProductDto } from '../dto';
import { PurchasesOrderInterface, PurchasesOrderProductInterface } from '../interfaces';

export const PurchasesOrderSearch: FC = () => {

  // * hooks
  const context = useContext(purchasesOrderContext);
  if (!context) 
    throw new Error("PurchasesOrderSearch: PurchasesOrderContext must be used within an PurchasesOrderProvider");

  const { formSearch, setFormSearch, search: searchOrders, updateTable, formatCode } = context;

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
    const providerNameIdDoc = formSearch.providerNameIdDoc?.length > 3 ? formSearch.providerNameIdDoc : undefined;
    const comment           = formSearch.comment?.length           > 3 ? formSearch.comment           : undefined;

    if (!(createdAtInit || createdAtEnd || code || providerNameIdDoc || comment)) {
      updateTable(TableActionEnum.LOAD);
      return;
    }

    searchOrders(createdAtInit, createdAtEnd, code, providerNameIdDoc, comment)
    .then( (orderList: PurchasesOrderInterface[]) => {
      
      const formOrderList: FormPurchasesOrderDto[] = orderList.map( (purchasesOrder: PurchasesOrderInterface) => {
        
        const formOrderProductList: FormPurchasesOrderProductDto[] = purchasesOrder.productList.map( (orderProduct: PurchasesOrderProductInterface) => {
          const formOrderProduct = new FormPurchasesOrderProductDto(uuidv4(), orderProduct.id, orderProduct.qty, orderProduct.name, orderProduct.cost, 0, orderProduct.amount, false, orderProduct.status, orderProduct.comment, orderProduct.code);
          return formOrderProduct;
        });
        
        const formattedCode = formatCode(purchasesOrder.code ?? 0);
        return new FormPurchasesOrderDto(purchasesOrder.providerName, purchasesOrder.amount, purchasesOrder.status, formOrderProductList, purchasesOrder.id, formattedCode, purchasesOrder.providerIdDoc, purchasesOrder.providerEmail, purchasesOrder.providerPhone, purchasesOrder.providerAddress, purchasesOrder.comment, purchasesOrder.documentTypeId, purchasesOrder.documentNumber, purchasesOrder.purchaseTypeId, purchasesOrder.createdAt, undefined);
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
            name="providerNameIdDoc"
            className="form-control"
            value={formSearch.providerNameIdDoc}
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
