import { useState, useEffect, useReducer } from 'react'

import { ProductsProductContext } from './ProductsProductContext';
import { useSearchProduct, useUpdateProduct, useDeleteProduct } from '../hooks/useProductsProduct';

import { tableReducer } from '../../common/hooks/TableReducer'
import { TableActionEnum } from '../../common/enums/table-actions.enum';

const initObj = {
  id: undefined,
  name: "",
  code: "",
  description: "",
  cost: 0,
  price: 0,
  hasFormula: false,
  active: true,
  elementList: []
}

export const ProductsProductProvider = ({ children }) => {

  // * hooks
  const [obj, setObj] = useState(initObj);
  const [objList, dispatchObjList] = useReducer(tableReducer, []); // * reducer, init state, init function
  const [errors, setErrors] = useState({});
  const [showMessage, setShowMessage] = useState(false);
  const { fetchProducts/*, productList = [], loading, error*/ } = useSearchProduct();
  const { mutateProduct/*, data, loading, error*/ } = useUpdateProduct();
  const { mutateDeleteProduct/*, data, loading, error*/ } = useDeleteProduct();
  const [productElementList, dispatchProductElementList] = useReducer(tableReducer, []);

  useEffect(() => {
    // alert(`useEffect`);
    setObj({ ...obj, cost: calculateCost(productElementList), elementList: productElementList });
  }, [productElementList]);

  // * handles
  const updateTable = (obj, actionType) => { // * obj can be a value or an array

    if(obj.length > 0)
      console.log(`updateTable: obj=(${obj.length}), actionType=${actionType}`);
    else console.log(`updateTable: obj=${JSON.stringify(obj)}, actionType=${actionType}`);

    const action = {
      type: actionType,
      payload: obj
    }

    dispatchObjList( action );
  }

  const updateForm = (obj = initObj) => {
    setObj(obj);
  }

  const cleanForm = () => {
    setObj(initObj);
    updateTableProductElement([], TableActionEnum.CLEAN);
    setErrors({});
  }

  const calculateCost = (productElementList) => {

    if(productElementList.length === 0) return 0;

    const cost = productElementList.reduce((acc, value) => {
      // alert(`calculateCost: cost=${value.cost}, active=${value.active}`);
      if(value.active){
        acc += parseFloat(value.cost) * parseFloat(value.qty);
      }
      return acc;
    }, 0);

    // alert(`calculateCost: cost=${cost}`);
    return cost;
  }

  const calculateProfitMargin = (obj) => {
    const cost = parseFloat(obj.cost) || 0;
    const price = parseFloat(obj.price) || 0;
    const profitMargin = ((price - cost) / price) * 100;

    if(profitMargin < 0) 
      return 0;

    return profitMargin;
  }

  const updateTableProductElement = (obj, actionType) => { // * obj can be a value or an array
    // alert(`updateTableProductElement: obj=${JSON.stringify(obj)}, actionType=${actionType}`);

    const action = {
      type: actionType,
      payload: obj
    }

    dispatchProductElementList( action );
  }

  // * api handles
  const findProducts = (name) => {

    const searchList = [name];

    return fetchProducts({ variables: { searchList } })
    .then(({ data }) => {
      const payload = data?.productsProductFind?.payload || [];
      console.log(`findProducts: data=${JSON.stringify(payload)}`);
      return payload;
    })
    .catch((error) => {
      console.error('Error fetching products:', error);
    });

  }

  const saveProduct = (obj) => {
    console.log(`saveProduct: obj=${JSON.stringify(obj)}`);
    
    const elementListAux = obj.elementList.reduce((acc, value) => {
      if(value.active){
        acc.push({
          id  : value.id,
          name: value.name,
          qty : parseFloat(value.qty),
        });
      }

      return acc;
    }, []);

    const objAux = {
      id          : obj.id ? obj.id : undefined,
      name        : obj.name,
      code        : obj.code ? obj.code : undefined,
      description : obj.description ? obj.description : undefined,
      cost        : parseFloat(obj.cost),
      price       : parseFloat(obj.price),
      hasFormula  : obj.hasFormula ? obj.hasFormula : false,
      active      : obj.active,
      elementList : elementListAux
    }
    
    return mutateProduct({ variables: { input: objAux } })
    .then(({ data }) => {
      const payload = data?.productsProductUpdate?.payload || [];
      return payload[0];
    })
    .catch((error) => {
      console.error('Error saving product:', error);
    });
  }

  const deleteProduct = (obj) => {
    
    return mutateDeleteProduct({ variables: { id: obj.id } })
    .then(({ data }) => {
      const payload = data?.productsProductDelete?.payload || [];
      return payload[0];
    })
    .catch((error) => {
      console.error('Error deleting product:', error);
    });
  }

  // * return component
  return (
    <ProductsProductContext.Provider 
      value={{ 
        obj, 
        objList, 
        errors, 
        showMessage, 
        
        updateTable, 
        updateForm, 
        cleanForm,
        calculateProfitMargin, 
        updateTableProductElement, 
        setErrors, 
        setShowMessage,

        findProducts, 
        saveProduct, 
        deleteProduct
      }}>
      {children}
    </ProductsProductContext.Provider>
  )
}
