import { useState, useContext } from 'react';
import { PurchasesOrderContext, PurchasesProductProvider } from '../context';
import { PurchasesOrderProductSearch } from './PurchasesOrderProductSearch';
import { PurchasesOrderProductTable } from './PurchasesOrderProductTable';
import { InputAmount } from '../../../common/components';
import { PurchasesOrderStatusEnum } from '../enums';

export const PurchasesOrderTabs = () => {
  const context = useContext(PurchasesOrderContext);
  if (!context) 
    throw new Error("PurchasesOrderPage: PurchasesOrderContext must be used within an PurchasesOrderProvider");

  const { form, formError } = context;
    

  const [activeTab, setActiveTab] = useState('resumen');

  return (
    <div>
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'resumen' ? 'active' : ''}`}
            onClick={() => setActiveTab('resumen')}
          >
            Productos
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'historial' ? 'active' : ''}`}
            onClick={() => setActiveTab('historial')}
          >
            Facturas
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'comentarios' ? 'active' : ''}`}
            onClick={() => setActiveTab('comentarios')}
          >
            Historial
          </button>
        </li>
      </ul>

      {/* Tab content */}
      <div className="tab-content border border-top-0">
        {activeTab === 'resumen' && (
          // <div className="border rounded mt-2">
          <>
            <div className="p-3">
              { form.status === PurchasesOrderStatusEnum.CANCELLED
                ? ( <div/> )
                : ( 
                    <PurchasesProductProvider>
                      <PurchasesOrderProductSearch />
                    </PurchasesProductProvider>
                  )
              }

              <div className="mt-2 border rounded overflow-auto" style={{ maxHeight: '330px' }}>
                <PurchasesOrderProductTable />
                {formError.productList && <div className="custom-invalid-feedback">{formError.productList}</div>}
              </div>
            </div>

            <div className="d-flex p-3">

              <div className="col-6"/>

              <div className="col-6">
                {/* <div className="d-flex align-items-center gap-2">
                  <label className="form-label mt-2 w-50 text-end">SubTotal:</label>
                  <InputAmount className="form-control form-control-sm" value={form.subTotal} readOnly={true} />
                </div>

                <div className="d-flex align-items-center gap-2">
                  <label className="form-label mt-2 w-50 text-end">IVA:</label>
                  <InputAmount className="form-control form-control-sm mt-2" value={form.iva} readOnly={true} />
                </div> */}

                <div className="d-flex align-items-center gap-2">
                  <label className="form-label mt-2 w-50 text-end">Total:</label>
                  <InputAmount className="form-control form-control-sm mt-2" value={form.total} readOnly={true} />
                </div>
              </div>

            </div>

          {/* </div> */}
          </>
        )}
        
        {activeTab === 'historial' && <div>Contenido del historial</div>}
        {activeTab === 'comentarios' && <div>Contenido de comentarios</div>}
      </div>
    </div>
  );
};