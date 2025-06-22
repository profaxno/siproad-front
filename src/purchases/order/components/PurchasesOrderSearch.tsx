import type { FC } from "react";
import { ChangeEvent, useContext, useEffect } from 'react';

import { v4 as uuidv4 } from 'uuid';

import { PurchasesOrderContext } from '../context/PurchasesOrderContext';
import { TableActionEnum } from '../../../common/enums/table-actions.enum';
import { FormPurchasesOrderInterface, FormPurchasesOrderProductInterface, PurchasesOrderInterface } from '../interfaces';

// import { ScreenMessageTypeEnum } from '../../../common/enums/screen-message-type-enum';
import { PurchasesOrderProductInterface } from '../interfaces/purchases-order.interface';

export const PurchasesOrderSearch: FC = () => {

  // * hooks
  const context = useContext(PurchasesOrderContext);
  if (!context) 
    throw new Error("PurchasesOrderSearch: PurchasesOrderContext must be used within an PurchasesOrderProvider");

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
    const providerNameIdDoc = formSearch.providerNameIdDoc?.length > 3 ? formSearch.providerNameIdDoc : undefined;
    const comment           = formSearch.comment?.length           > 3 ? formSearch.comment           : undefined;

    if (!(createdAtInit || createdAtEnd || code || providerNameIdDoc || comment)) {
      updateTable(TableActionEnum.LOAD);
      return;
    }

    searchOrders(createdAtInit, createdAtEnd, code, providerNameIdDoc, comment)
    .then( (orderList: PurchasesOrderInterface[]) => {
      
      const formOrderList: FormPurchasesOrderInterface[] = orderList.map( (purchasesOrder: PurchasesOrderInterface) => {
        
        const formOrderProductList: FormPurchasesOrderProductInterface[] = purchasesOrder.productList.map( (orderProduct: PurchasesOrderProductInterface) => {
          
          const formOrderProduct = {
            key     : uuidv4(),
            id      : orderProduct.id,
            qty     : orderProduct.qty,
            comment : orderProduct.comment,
            name    : orderProduct.name,
            code    : orderProduct.code,
            cost    : orderProduct.cost,
            amount  : orderProduct.amount,
            updateProductCost : false,
            status  : orderProduct.status
          };

          return formOrderProduct;
        });
        
        return {
          id            : purchasesOrder.id,
          code          : purchasesOrder.code,
          purchaseTypeId: purchasesOrder.purchaseTypeId,
          documentTypeId: purchasesOrder.documentTypeId,
          providerIdDoc : purchasesOrder.providerIdDoc,
          providerName  : purchasesOrder.providerName,
          providerEmail : purchasesOrder.providerEmail,
          providerPhone : purchasesOrder.providerPhone,
          providerAddress: purchasesOrder.providerAddress,
          comment       : purchasesOrder.comment,
          amount        : purchasesOrder.amount,
          documentNumber: purchasesOrder.documentNumber,
          createdAt     : purchasesOrder.createdAt,
          status        : purchasesOrder.status,
          productList   : formOrderProductList,
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
