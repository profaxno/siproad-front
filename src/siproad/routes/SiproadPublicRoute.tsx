import { FC } from "react";
import { ReactNode, useContext } from 'react'
import { Navigate } from 'react-router';

import { AuthContext } from '../../auth/context/AuthContext';

type Props = {
  children: ReactNode;
};

export const SiproadPublicRoute: FC<Props> = ({ children }) => {

  // * Hooks
  const context = useContext(AuthContext);
  
  if (!context) 
      throw new Error("AuthContext must be used within an AuthProvider");
  
  const { authState } = context;
  
  
  return (!authState.logged) ? children : <Navigate to="/" />;
}
