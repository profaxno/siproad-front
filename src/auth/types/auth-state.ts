import { Company, User } from "./login-response";

export type AuthState = {
  user    : User;
  company : Company;
  token   : string;
  logged? : boolean;
};