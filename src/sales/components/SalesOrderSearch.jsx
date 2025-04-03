import { v4 as uuidv4 } from 'uuid';
import React, { use, useState, useEffect } from 'react'
import { InputAmount } from '../../common/components/InputAmount';
import { InputSearch } from '../../common/components/InputSearch';
import { useSearchOrder } from '../hooks/useOrder';

const initOrderProduct = {
  key: 0,
  id: 0,
  name: '',
  code: '',
  qty: 1,
  cost: 0,
  price: 0,
  discountPct: 0,
  subTotal: 0,
  status: 1 // * 1: active, 0: inactive
}

export const SalesOrderSearch = ({onNotifyUpdateOrder, onNotifyUpdateOrderList}) => {
  
  // * hooks
  const [inputValue, setInputValue] = useState();
  const [orderProduct, setOrderProduct] = useState(initOrderProduct);
  const { fetchOrders, orderList = [], loading, error } = useSearchOrder();

  console.log(`rendered...`);

  // * handles
  const handleInputChange = async(e) => {
    const value = e.target.value;
    
    setInputValue(value);

    if(value.length < 3) {
      onNotifyUpdateOrderList([]);
      return;
    }

    const searchList = [value];

    const { data } = await fetchOrders({ variables: { searchList } })
    if (data) {
      const payload = data?.salesOrderFind?.payload || [];
      onNotifyUpdateOrderList(payload);
    }

  }
  
  // const onSearchObjectList = async(searchValue) => {
  //   console.log(`onSearchObjectList: searchValue="${searchValue}"`);
  //   const searchList = [searchValue];

  //   const { data } = await fetchOrders({ variables: { searchList } })
  //   if (data) {
  //     const payload = data?.salesOrderFind?.payload || [];
  //     console.log(`onSearchObjectList: payload=(${JSON.stringify(payload)})`);
  //     return payload;
  //   }
  // }

  // const updateSelectObject = (obj) => {
  //   console.log(`updateSelectObject: obj=${JSON.stringify(obj)}`);

  //   setOrderProduct({
  //     ...orderProduct,
  //     key: uuidv4(),
  //     id: obj.id,
  //     name: obj.name,
  //     code: obj.code,
  //     cost: obj.cost,
  //     price: obj.price,
  //     subTotal: orderProduct.qty * obj.price
  //   });
  // }

  // const cleanInput = () => {
  //   setOrderProduct(initOrderProduct);
  // }


  // * return component
  return (
    <>
      <div className="d-flex gap-2 mb-2">

        <div className="col-6 flex-wrap">
          <label className="form-label text-end">Comentarios:</label>

          <input
            name="comment"
            type="text"
            className={"form-control"} 
            value={inputValue}
            onChange={handleInputChange}
            // onKeyDown={handleKeyDown}
            placeholder={"Buscador..."}
          />
        </div>

        
      </div>
    </>
  )
}
