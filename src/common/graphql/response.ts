export interface ResponseInterface<T> {
  internalCode: number;
  message:      string;
  qty:          number;
  payload?: T;
}