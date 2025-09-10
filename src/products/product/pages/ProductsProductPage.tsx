import type { FC } from 'react';
import { useContext, useEffect } from 'react';

import { Message } from '../../../common/components';
import { ActiveStatusEnum, ActionEnum } from '../../../common/enums';

import { productsProductContext } from '../context/products-product.context';
import { ProductsProductButtons, ProductsProductSearch, ProductsProductSearchTable, ProductsProductForm, ProductsProductElementSearch, ProductsProductElementTable } from '../components';

export const ProductsProductPage: FC = () => {

  const context = useContext(productsProductContext);
  if (!context) 
    throw new Error("ProductsProductPage: productsProductContext must be used within an ProductsProductProvider");

  // * context
  const { actionList, setActionList, form, screenMessage, resetScreenMessage, isOpenSearchSection, isOpenFormSection, setIsOpenSearchSection, setIsOpenFormSection } = context;
  // const [actionList, setActionList] = useState<ActionEnum[]>([]);  

  useEffect(() => {

    switch (form.status) {
      case ActiveStatusEnum.NEW:
        setActionList([ActionEnum.NEW, ActionEnum.SAVE]);
        break;
      case ActiveStatusEnum.ACTIVE:
        setActionList([ActionEnum.NEW, ActionEnum.SAVE, ActionEnum.DELETE]);
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
              <ProductsProductSearch withMovements={false}/>
              <div className="mt-4 border rounded overflow-auto" style={{ maxHeight: '450px' }}>
                <ProductsProductSearchTable />
              </div>
            </div>
          )}
        </div>

      </div>

      <div className="col-sm-6">

        <div className="border rounded p-3" style={{ maxHeight: '750px' }}>
          <div className="d-flex border-bottom p-2 gap-2 justify-content-end">
            <ProductsProductButtons/>
          </div>

          <div className="mt-3 overflow-auto" style={{ height: '650px' }}>

            <div className="d-flex align-items-center gap-2">  
              <button
                className="custom-btn-outline-black-hamburger"
                onClick={() => setIsOpenFormSection(!isOpenFormSection)}
              />

              <h5 className="text-dark m-0">Producto</h5>
            </div>

            {isOpenFormSection && <ProductsProductForm />}

            <div className="mt-4">
              <h5 className="text-dark m-0">Elementos del Producto</h5>
            </div>

            <div className="border rounded mt-2">
              <div className="p-3">
                { 
                  actionList.includes(ActionEnum.SAVE)
                  ?  
                    // <ProductsProductProvider>
                      <ProductsProductElementSearch />
                    // </ProductsProductProvider>
                  : <div/>
                }
                
                <div className="mt-3 border rounded overflow-auto" style={{ maxHeight: '400px' }}>
                  <ProductsProductElementTable />
                </div>
              </div>  
            </div>

          </div>
        </div>

      </div>

      <Message screenMessage={screenMessage} onResetScreenMessage={resetScreenMessage} />
    </div>
  );
};
