// import { v4 as uuidv4 } from 'uuid';

import { TableActionEnum } from '../enums/table-actions.enum';
import { TableActionInterface } from '../interfaces/table-action.interface';

export const tableReducerWithKey = <T>(state: any[], action: TableActionInterface<any>): T[] => {
  switch (action.type) {

    case TableActionEnum.ADD: {
      return [action.payload, ...state];
    }

    case TableActionEnum.UPDATE:
    case TableActionEnum.DELETE: {
      if (!action.payload) {
        return state;
      }

      return state.map((value) => {
        if (value.key === action.payload?.key) {
          return action.payload;
        }
        return value;
      });
    }

    case TableActionEnum.LOAD: {
      return action.payload;
    }

    case TableActionEnum.CLEAN: {
      return [];
    }

    default:
      return state;
  }
};
