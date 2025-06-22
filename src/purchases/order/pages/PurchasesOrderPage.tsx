import type { FC } from 'react';
import { useState, useContext, useEffect } from 'react';

import { ButtonWithConfirm, InputAmount, Message } from '../../../common/components';
import { TableActionEnum } from '../../../common/enums/table-actions.enum';
import { ScreenMessageTypeEnum } from '../../../common/enums/screen-message-type-enum';

import { PurchasesOrderContext, PurchasesProductProvider } from '../context';

import { PurchasesOrderSearch } from '../components/PurchasesOrderSearch';
import { PurchasesOrderSearchTable } from '../components/PurchasesOrderSearchTable';

import { PurchasesOrderForm } from '../components/PurchasesOrderForm';
import { PurchasesOrderProductSearch } from '../components/PurchasesOrderProductSearch';
import { PurchasesOrderProductTable } from '../components/PurchasesOrderProductTable';
import { PurchasesOrderButtonGeneratePdfPrice } from '../components/PurchasesOrderButtonGeneratePdfPrice';
import { FormPurchasesOrderInterface, FormPurchasesOrderErrorInterface, PurchasesOrderInterface } from '../interfaces';
import { PurchasesOrderStatusEnum, PurchasesOrderStatusNameEnum } from '../enums/purchases-order-status.enum';
import { StatusBar } from '../../../common/components/statusBar';
import { ActionEnum } from '../../../common/enums/action.enum';
import { PurchasesOrderTabs } from '../components/PurchasesOrderTabs';
import { PurchasesOrderButtons } from '../components/PurchasesOrderButtons';

export const PurchasesOrderPage: FC = () => {

  const context = useContext(PurchasesOrderContext);
  if (!context) 
    throw new Error("PurchasesOrderPage: PurchasesOrderContext must be used within an PurchasesOrderProvider");

  const { isOpenOrderSection, form, screenMessage, resetScreenMessage } = context;
  const [isOpenOrderFormSection, setIsOpenOrderFormSection] = useState<boolean>(true);
  const [statusList, setStatusList] = useState<string[]>([]);
  const [actionList, setActionList] = useState<ActionEnum[]>([]);

  useEffect(() => {

    switch (form.status) {
      case PurchasesOrderStatusEnum.NEW:
        setStatusList([PurchasesOrderStatusNameEnum.NEW, PurchasesOrderStatusNameEnum.QUOTATION, PurchasesOrderStatusNameEnum.ORDER]);
        setActionList([ActionEnum.RETURN, ActionEnum.QUOTATION, ActionEnum.ORDER]);
        break;
      case PurchasesOrderStatusEnum.QUOTATION:
        setStatusList([PurchasesOrderStatusNameEnum.QUOTATION, PurchasesOrderStatusNameEnum.ORDER, PurchasesOrderStatusNameEnum.INVOICED]);
        setActionList([ActionEnum.RETURN_WITH_CONFIRM, ActionEnum.SAVE, ActionEnum.ORDER, ActionEnum.GENERATE_PDF, ActionEnum.DELETE]);
        break;
      case PurchasesOrderStatusEnum.ORDER:
        setStatusList([PurchasesOrderStatusNameEnum.QUOTATION, PurchasesOrderStatusNameEnum.ORDER, PurchasesOrderStatusNameEnum.INVOICED]);
        setActionList([ActionEnum.RETURN_WITH_CONFIRM, ActionEnum.SAVE, ActionEnum.BILL, ActionEnum.GENERATE_PDF, ActionEnum.DELETE]);
        break;
      case PurchasesOrderStatusEnum.INVOICED:
        setStatusList([PurchasesOrderStatusNameEnum.ORDER, PurchasesOrderStatusNameEnum.INVOICED, PurchasesOrderStatusNameEnum.PAID]);
        setActionList([ActionEnum.RETURN, ActionEnum.GENERATE_PDF, ActionEnum.DELETE]);
        break;
      case PurchasesOrderStatusEnum.PAID:
        setStatusList([PurchasesOrderStatusNameEnum.ORDER, PurchasesOrderStatusNameEnum.INVOICED, PurchasesOrderStatusNameEnum.PAID]);
        setActionList([ActionEnum.RETURN, ActionEnum.GENERATE_PDF, ActionEnum.DELETE]);
        break;
      case PurchasesOrderStatusEnum.CANCELLED:
        setStatusList([PurchasesOrderStatusNameEnum.QUOTATION, PurchasesOrderStatusNameEnum.ORDER, PurchasesOrderStatusNameEnum.CANCELLED]);
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
        <PurchasesOrderButtons actionList={actionList}/>
      </div>

      {!isOpenOrderSection && (
        <div>

          <div className="p-2 mt-3">
            <h5 className="text-dark m-0">Búsqueda Ordenes de Compras</h5>
          </div>

          <div className="row">
            <div className="col-sm-3 mb-3">
              <div className="border rounded p-3 mb-2">
                <PurchasesOrderSearch />
              </div>
            </div>

            <div className="col-sm-9 mb-3">
              <div className="border rounded overflow-auto" style={{ height: '630px' }}>
                <PurchasesOrderSearchTable />
              </div>
            </div>
          </div>

        </div>
      )}

      {isOpenOrderSection && (
        <div>
          
          {/* <div className="border-bottom">
            <StatusBar
              statusList={statusList}
              currentStatus={Object.values(PurchasesOrderStatusNameEnum)[form.status]}
            />
          </div> */}
         

          <div className="row mt-3">
            <div className="col-sm-5 mb-3">  
              <div className="d-flex align-items-center">
                <button className="d-block d-md-none custom-btn-outline-black-hamburger" onClick={() => setIsOpenOrderFormSection(!isOpenOrderFormSection)}/>
                
                <h5 className="text-dark m-0">
                  {form.status == PurchasesOrderStatusEnum.QUOTATION ? PurchasesOrderStatusNameEnum.QUOTATION : PurchasesOrderStatusNameEnum.ORDER} {form.code}
                </h5>
              </div>

              {isOpenOrderFormSection && (
                <div className="border rounded mt-2 p-3">
                  <PurchasesOrderForm />
                </div>
              )}
            </div>

            <div className="col-sm-7">
              <PurchasesOrderTabs/>
            </div>
          </div>

        </div>
      )}

      <Message screenMessage={screenMessage} onResetScreenMessage={resetScreenMessage} />
    </div>
  );
};
