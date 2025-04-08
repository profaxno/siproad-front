import React from 'react'
import { ProductsProductTable } from '../components/ProductsProductTable';

export const ProductsPage = () => {
  const [isOpenSearchSection, setIsOpenSearchSection] = useState(true);

  return (
     <div className="row mt-3">
          
      {/* search */}
      <div className="col-sm-6 mb-3">
        
        <div className="border rounded p-3" style={{ maxHeight: '650px'}}>
          
          <div className="d-flex align-items-center gap-2">
            <span
              className="d-block d-md-none fs-2" // * hidden on large screens
              onClick={() => setIsOpenSearchSection(!isOpenSearchSection)}
              style={{ cursor: "pointer" }}
            >
              <FaBars className="text-dark"/>
            </span>

            <h4 className="text-dark m-0">Búsqueda de Productos</h4>  
          </div>

          {/* <h4 className="mb-2">Búsqueda de Ordenes</h4> */}
          {isOpenSearchSection && (
          <div className="border rounded mt-3 p-3">
            {/* <SalesOrderSearch onNotifyUpdateOrder={updateOrder} onNotifyUpdateOrderList={updateOrderList} isClean={cleanSearchInput}/> */}
            
            <div className="mt-3 overflow-auto" style={{ maxHeight: '500px'}}>
              <ProductsProductTable/>
            </div>
          </div>
          )}
        </div>
        
      </div>

      {/* update */}
      <div className="col-sm-6">

        <div className="border rounded p-3">

          

        </div>
        
      </div>

    </div>
  )
}
