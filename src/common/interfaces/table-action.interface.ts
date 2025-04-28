import { TableActionEnum } from "../enums/table-actions.enum";

export interface TableActionInterface<T> {
  type: TableActionEnum;
  payload?: T | T[];
}