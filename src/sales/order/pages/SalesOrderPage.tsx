import type { FC } from 'react';
import { useState, useContext, useEffect } from 'react';

import { Message, StatusBar } from '../../../common/components';

import { salesOrderContext } from '../context/sales-order.context';
import { SalesOrderStatusEnum, SalesOrderStatusNameEnum, SalesActionEnum } from '../enums';
import { SalesOrderSearch, SalesOrderSearchTable, SalesOrderButtons, SalesOrderForm, SalesOrderTabs } from '../components';

export const SalesOrderPage: FC = () => {

  const context = useContext(salesOrderContext);
  if (!context) 
    throw new Error("SalesOrderPage: salesOrderContext must be used within an SalesOrderProvider");

  const { setActionList, isOpenOrderSection, form, screenMessage, resetScreenMessage } = context;
  const [isOpenOrderFormSection, setIsOpenOrderFormSection] = useState<boolean>(true);
  const [statusList, setStatusList] = useState<string[]>([]);
  
  useEffect(() => {

    switch (form.status) {
      case SalesOrderStatusEnum.NEW:
        setStatusList([SalesOrderStatusNameEnum.NEW, SalesOrderStatusNameEnum.QUOTATION, SalesOrderStatusNameEnum.ORDER]);
        setActionList([SalesActionEnum.RETURN, SalesActionEnum.QUOTATION, SalesActionEnum.ORDER]);
        break;
      case SalesOrderStatusEnum.QUOTATION:
        setStatusList([SalesOrderStatusNameEnum.QUOTATION, SalesOrderStatusNameEnum.ORDER, SalesOrderStatusNameEnum.INVOICED]);
        setActionList([SalesActionEnum.RETURN_WITH_CONFIRM, SalesActionEnum.SAVE, SalesActionEnum.ORDER, SalesActionEnum.GENERATE_PDF, SalesActionEnum.DELETE]);
        break;
      case SalesOrderStatusEnum.ORDER:
        setStatusList([SalesOrderStatusNameEnum.QUOTATION, SalesOrderStatusNameEnum.ORDER, SalesOrderStatusNameEnum.INVOICED]);
        setActionList([SalesActionEnum.RETURN_WITH_CONFIRM, SalesActionEnum.SAVE, SalesActionEnum.BILL, SalesActionEnum.GENERATE_PDF, SalesActionEnum.DELETE]);
        break;
      case SalesOrderStatusEnum.INVOICED:
        setStatusList([SalesOrderStatusNameEnum.ORDER, SalesOrderStatusNameEnum.INVOICED, SalesOrderStatusNameEnum.PAID]);
        setActionList([SalesActionEnum.RETURN, SalesActionEnum.GENERATE_PDF, SalesActionEnum.DELETE]);
        break;
      case SalesOrderStatusEnum.PAID:
        setStatusList([SalesOrderStatusNameEnum.ORDER, SalesOrderStatusNameEnum.INVOICED, SalesOrderStatusNameEnum.PAID]);
        setActionList([SalesActionEnum.RETURN, SalesActionEnum.GENERATE_PDF, SalesActionEnum.DELETE]);
        break;
      case SalesOrderStatusEnum.CANCELLED:
        setStatusList([SalesOrderStatusNameEnum.QUOTATION, SalesOrderStatusNameEnum.ORDER, SalesOrderStatusNameEnum.CANCELLED]);
        setActionList([SalesActionEnum.RETURN]);
        break;
      default:
        setStatusList([]);
    }

  }, [form.status])

  // * handles
  
  
  return (
    <div className="mt-3">

      <div className="d-flex border-bottom p-2 gap-2">
        <SalesOrderButtons/>
      </div>

      {!isOpenOrderSection && (
        <div>

          <div className="p-2 mt-3">
            <h5 className="text-dark m-0">Búsqueda Ordenes de Ventas</h5>
          </div>

          <div className="row">
            <div className="col-sm-3 mb-3">
              <div className="border rounded p-3 mb-2">
                <SalesOrderSearch />
              </div>
            </div>

            <div className="col-sm-9 mb-3">
              <div className="border rounded overflow-auto" style={{ height: '630px' }}>
                <SalesOrderSearchTable />
              </div>
            </div>
          </div>

        </div>
      )}

      {isOpenOrderSection && (
        <div>
          
          <div className="border-bottom">
            <StatusBar
              statusList={statusList}
              currentStatus={Object.values(SalesOrderStatusNameEnum)[form.status]}
            />
          </div>
         

          <div className="row mt-3">
            <div className="col-sm-5 mb-3">  
              <div className="d-flex align-items-center">
                <button className="d-block d-md-none custom-btn-outline-black-hamburger" onClick={() => setIsOpenOrderFormSection(!isOpenOrderFormSection)}/>
                
                <h5 className="text-dark m-0">
                  {form.status == SalesOrderStatusEnum.QUOTATION ? SalesOrderStatusNameEnum.QUOTATION : SalesOrderStatusNameEnum.ORDER}: {form.code}
                </h5>
              </div>

              {isOpenOrderFormSection && (
                <div className="border rounded mt-2 p-3">
                  <SalesOrderForm />
                </div>
              )}
            </div>

            <div className="col-sm-7">
              <SalesOrderTabs/>
            </div>
          </div>

        </div>
      )}

      <Message screenMessage={screenMessage} onResetScreenMessage={resetScreenMessage} />
    </div>
  );
};
