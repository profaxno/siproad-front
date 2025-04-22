import { v4 as uuidv4 } from 'uuid';
import { TableActionEnum } from '../enums/table-actions.enum';
import { TableActionInterface } from '../interfaces/table-action.interface';

export const tableReducer = <T>(state: any[], action: TableActionInterface<any>): T[] => {
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
        if (value.id === action.payload?.id) {
          return action.payload;
        }
        return value;
      });
    }

    case TableActionEnum.LOAD: {
      if (!action.payload) {
        return [];
      }

      return action.payload.map((value: any) => {
        const itemAux: any = {
          ...value,
          key: uuidv4(),
        };

        return itemAux;
      });
    }

    case TableActionEnum.CLEAN: {
      return [];
    }

    default:
      return state;
  }
};
