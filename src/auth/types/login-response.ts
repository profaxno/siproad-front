export interface LoginResponse {
  internalCode: number;
  message:      string;
  qty:          number;
  payload:      Payload;
}

export interface Payload {
  user:    User;
  company: Company;
  token:   string;
}

export interface Company {
  name:        string;
  fantasyName: string;
  idDoc:       string;
  address:     string;
  email:       string;
  phone:       string;
  bank:        Bank;
  images:      Image[];
}

export interface Bank {
  name:          string;
  accountType:   string;
  accountNumber: string;
}

export interface Image {
  name:  string;
  image: string;
}

export interface User {
  name: string;
}
