import type { FC } from "react";
import { useState, useReducer, createContext, ReactNode } from "react";

import { ScreenMessageTypeEnum } from "../../common/enums/screen-message-type-enum";
import { ScreenMessageInterface } from "../../common/interfaces/screen-message.interface";

import type { AuthState, AuthAction } from "../types";
import { AuthActionTypeEnum } from "../enums/auth-action-type-enum";
import { authReducer } from "../helpers/authReducer";
import { Company, User } from "../types/login-response";

// * context
type AuthContextType = {
  authState: AuthState;
  onLogin: (user: User, company: Company, token: string) => void;
  onLogout: () => void;

  screenMessage: ScreenMessageInterface;
  setScreenMessage: React.Dispatch<React.SetStateAction<ScreenMessageInterface>>;
  resetScreenMessage: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);


// * provider
type Props = {
  children: ReactNode;
};

const init = (): AuthState => {
  const session = JSON.parse(localStorage.getItem("session") || "null");

  return {
    logged  : !!session,
    user    : session?.user,
    company : session?.company,
    token   : session?.token,
  };
};

const initialScreenMessage: ScreenMessageInterface = {
  type: ScreenMessageTypeEnum.SUCCESS,
  title: "",
  message: "",
  show: false,
};

export const AuthProvider: FC<Props> = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer as React.Reducer<AuthState, AuthAction>, {}, init);
  const [screenMessage, setScreenMessage] = useState<ScreenMessageInterface>(initialScreenMessage);

  const resetScreenMessage = () => setScreenMessage(initialScreenMessage);

  const onLogin = (user: User, company: Company, token: string) => {
    
    const session = { user, company, token };
    
    // * update localStorage
    localStorage.setItem("session", JSON.stringify(session));

    // * update authState
    const action: AuthAction = {
      type: AuthActionTypeEnum.LOGIN,
      payload: session,
    };
    
    dispatch(action);
  };

  const onLogout = () => {
    localStorage.removeItem("session");
    dispatch({ type: AuthActionTypeEnum.LOGOUT });
  };

  return (
    <AuthContext.Provider value={{ 
      authState, 
      onLogin, 
      onLogout, 
      
      screenMessage, 
      setScreenMessage, 
      resetScreenMessage 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
