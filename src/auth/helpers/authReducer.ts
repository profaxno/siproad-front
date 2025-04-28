import { AuthActionTypeEnum } from '../enums/auth-action-type-enum'
import { AuthAction } from '../types/auth-action'
import { AuthState } from '../types/auth-state'

export const authReducer = (state: AuthState, action: AuthAction) => {

  switch (action.type) {

    case AuthActionTypeEnum.LOGIN:
      return {
        ...state,
        user    : action.payload?.user,
        company : action.payload?.company,
        token   : action.payload?.token,
        logged  : true,
      }

    case AuthActionTypeEnum.LOGOUT:
      return {
        ...state,
        user    : null,
        company : null,
        token   : null,
        logged  : false
      }

    default:
      return state
      
  }
  
}