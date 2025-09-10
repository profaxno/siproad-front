import type { FC } from 'react';
import { useState, useContext, useEffect } from 'react';

import { ButtonWithConfirm, Message } from '../../../common/components';
import { TableActionEnum, ScreenMessageTypeEnum, ActiveStatusEnum } from '../../../common/enums';


import { ActionEnum } from '../../../common/enums/action.enum';
import { productsProductContext } from '../../product/context/products-product.context';
import { ProductsProductSearch } from '../../product/components/ProductsProductSearch';
import { ProductsProductSearchTable } from '../../product/components/ProductsProductSearchTable';
import { ProductTypeEnum } from '../../product/enums';

export const ProductsStockPage: FC = () => {

  const context = useContext(productsProductContext);
  if (!context) 
    throw new Error("ProductsStockPage: productsProductContext must be used within an ProductsProductProvider");

  // * context
  const { actionList, setActionList, form, screenMessage, setScreenMessage, resetScreenMessage, isOpenSearchSection, isOpenFormSection, setIsOpenSearchSection, setIsOpenFormSection } = context;
  // const [actionList, setActionList] = useState<ActionEnum[]>([]);  

  useEffect(() => {

    switch (form.status) {
      case ActiveStatusEnum.NEW:
        setActionList([ActionEnum.NEW, ActionEnum.SAVE]);
        break;
      case ActiveStatusEnum.ACTIVE:
        setActionList([ActionEnum.NEW, ActionEnum.SAVE, ActionEnum.DELETE]);
        // setActionList([]);
        break;
      default:
        setActionList([]);
    }

  }, [form.status])

  // * handles
  

  return (
    <div className="row mt-3">
      
      <div className="col-sm-6 mb-3">

        <div className="border rounded p-3" style={{ maxHeight: '750px' }}>
          <div className="d-flex align-items-center gap-2">
            <button
              className="d-block d-md-none custom-btn-outline-black-hamburger"
              onClick={() => setIsOpenSearchSection(!isOpenSearchSection)}
            />
            
            <h4 className="text-dark m-0">Búsqueda de Productos</h4>
          </div>

          {isOpenSearchSection && (
            <div className="mt-3">
              <ProductsProductSearch withMovements={true} productTypeList={[ProductTypeEnum.P]}/>
              <div className="mt-4 border rounded overflow-auto" style={{ maxHeight: '450px' }}>
                <ProductsProductSearchTable />
              </div>
            </div>
          )}
        </div>

      </div>

      <div className="col-sm-6">

        <div className="border rounded p-3" style={{ maxHeight: '750px' }}>
          
        </div>

      </div>

      <Message screenMessage={screenMessage} onResetScreenMessage={resetScreenMessage} />
    </div>
  );
};
