import type { FC } from 'react';
import { useState, useContext, useEffect } from 'react';

import { ButtonWithConfirm, InputAmount, Message } from '../../../common/components';
import { TableActionEnum } from '../../../common/enums/table-actions.enum';
import { ScreenMessageTypeEnum } from '../../../common/enums/screen-message-type-enum';

import { SalesOrderContext, SalesProductProvider } from '../context';

import { SalesOrderSearch } from '../components/SalesOrderSearch';
import { SalesOrderSearchTable } from '../components/SalesOrderSearchTable';

import { SalesOrderForm } from '../components/SalesOrderForm';
import { SalesOrderProductSearch } from '../components/SalesOrderProductSearch';
import { SalesOrderProductTable } from '../components/SalesOrderProductTable';
import { SalesOrderButtonGeneratePdfPrice } from '../components/SalesOrderButtonGeneratePdfPrice';
import { FormSalesOrderInterface, FormSalesOrderErrorInterface, SalesOrderInterface } from '../interfaces';
import { SalesOrderStatusEnum, SalesOrderStatusNameEnum } from '../enums/sales-order-status.enum';
import { StatusBar } from '../../../common/components/statusBar';
import { ActionEnum } from '../../../common/enums/action.enum';
import { SalesOrderTabs } from '../components/SalesOrderTabs';
import { SalesOrderButtons } from '../components/SalesOrderButtons';

export const SalesOrderPage: FC = () => {

  const context = useContext(SalesOrderContext);
  if (!context) 
    throw new Error("SalesOrderPage: SalesOrderContext must be used within an SalesOrderProvider");

  const { isOpenOrderSection, form, screenMessage, resetScreenMessage } = context;
  const [isOpenOrderFormSection, setIsOpenOrderFormSection] = useState<boolean>(true);
  const [statusList, setStatusList] = useState<string[]>([]);
  const [actionList, setActionList] = useState<ActionEnum[]>([]);

  useEffect(() => {

    switch (form.status) {
      case SalesOrderStatusEnum.NEW:
        setStatusList([SalesOrderStatusNameEnum.NEW, SalesOrderStatusNameEnum.QUOTATION, SalesOrderStatusNameEnum.ORDER]);
        setActionList([ActionEnum.RETURN, ActionEnum.QUOTATION, ActionEnum.ORDER]);
        break;
      case SalesOrderStatusEnum.QUOTATION:
        setStatusList([SalesOrderStatusNameEnum.QUOTATION, SalesOrderStatusNameEnum.ORDER, SalesOrderStatusNameEnum.INVOICED]);
        setActionList([ActionEnum.RETURN_WITH_CONFIRM, ActionEnum.SAVE, ActionEnum.ORDER, ActionEnum.GENERATE_PDF, ActionEnum.DELETE]);
        break;
      case SalesOrderStatusEnum.ORDER:
        setStatusList([SalesOrderStatusNameEnum.QUOTATION, SalesOrderStatusNameEnum.ORDER, SalesOrderStatusNameEnum.INVOICED]);
        setActionList([ActionEnum.RETURN_WITH_CONFIRM, ActionEnum.SAVE, ActionEnum.BILL, ActionEnum.GENERATE_PDF, ActionEnum.DELETE]);
        break;
      case SalesOrderStatusEnum.INVOICED:
        setStatusList([SalesOrderStatusNameEnum.ORDER, SalesOrderStatusNameEnum.INVOICED, SalesOrderStatusNameEnum.PAID]);
        setActionList([ActionEnum.RETURN, ActionEnum.GENERATE_PDF, ActionEnum.DELETE]);
        break;
      case SalesOrderStatusEnum.PAID:
        setStatusList([SalesOrderStatusNameEnum.ORDER, SalesOrderStatusNameEnum.INVOICED, SalesOrderStatusNameEnum.PAID]);
        setActionList([ActionEnum.RETURN, ActionEnum.GENERATE_PDF, ActionEnum.DELETE]);
        break;
      case SalesOrderStatusEnum.CANCELLED:
        setStatusList([SalesOrderStatusNameEnum.QUOTATION, SalesOrderStatusNameEnum.ORDER, SalesOrderStatusNameEnum.CANCELLED]);
        setActionList([ActionEnum.RETURN]);
        break;
      default:
        setStatusList([]);
    }

  }, [form.status])

  // * handles
  
  
  return (
    <div className="mt-3">

      <div className="d-flex border-bottom p-2 gap-2">
        <SalesOrderButtons actionList={actionList}/>
      </div>

      {!isOpenOrderSection && (
        <div>

          <div className="p-2 mt-3">
            <h5 className="text-dark m-0">Búsqueda de Ordenes</h5>
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
                  {form.status == SalesOrderStatusEnum.QUOTATION ? SalesOrderStatusNameEnum.QUOTATION : SalesOrderStatusNameEnum.ORDER} {form.code}
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
