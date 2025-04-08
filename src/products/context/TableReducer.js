import { v4 as uuidv4 } from 'uuid';

import { TableActionEnum } from '../enums/table-actions.enum'

export const tableReducer = (state, action) => {

  // alert(`tableReducer: state=${JSON.stringify(state)}, action=${JSON.stringify(action)}`);
  
  switch (action.type) {
  
    case TableActionEnum.ADD: {
      const itemAux = {
        ...action.payload,
        key: uuidv4()
      }

      return [itemAux, ...state];
    }

    case TableActionEnum.UPDATE:
    case TableActionEnum.DELETE:
      return state.map((value) => {
        if(value.key === action.payload.key)
          return action.payload;
        return value;
      })
    
    case TableActionEnum.LOAD: {
      return action.payload.map((value) => {
        const itemAux = {
          ...value,
          key: uuidv4()
        }
        
        return itemAux;
      })
    }
    
    case TableActionEnum.CLEAN: {
      return [];
    }

    default:
      return state;
      
  }
  
}