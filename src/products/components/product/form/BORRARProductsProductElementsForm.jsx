import { useState, useReducer, useContext, useEffect } from 'react'
import { tableReducer } from '../../../context/TableReducer';
import { ProductsProductContext } from '../../../context/ProductsProductContext';
import { ProductsElementProvider } from '../../../context/ProductsElementProvider';
import { ProductsProductElementSearch } from './ProductsProductElementSearch';
import { ProductsProductElementTable } from './ProductsProductElementTable';

export const ProductsProductElementsForm = () => {
  
  // * hooks
  const { obj, updateForm, errors } = useContext(ProductsProductContext);

  const [productElementList, dispatchProductElementList] = useReducer(tableReducer, []);

  useEffect(() => {
    const objAux = { ...obj, elementList: productElementList };
    updateForm(objAux);
  }, [productElementList]);


  // * handles
  const updateTable = (value, actionType) => { // * obj can be a value or an array
    const action = {
      type: actionType,
      payload: value
    }

    dispatchProductElementList( action );
  }

  return (
   <div className="border rounded mt-2">
                 
      <div className="p-3">
        <ProductsElementProvider>
          <ProductsProductElementSearch onNotifyUpdateTable={updateTable} /*onNotifyUpdateOrderProduct={updateOrderProduct} isClean={cleanSearchInput}*//>
        </ProductsElementProvider>
        
        <div className="mt-3 overflow-auto" style={{ maxHeight: '400px'}}>
          <ProductsProductElementTable onNotifyUpdateTable={updateTable}/>
          {errors.productList && <div className="custom-invalid-feedback border rounded p-1">{errors.productList}</div>}
        </div>
      </div>

    </div>
  )
}
