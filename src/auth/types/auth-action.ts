import { AuthActionTypeEnum } from "../enums/auth-action-type-enum";
import { AuthState } from "./auth-state";

export type AuthAction = {
  type    : AuthActionTypeEnum;
  payload?: AuthState;
}