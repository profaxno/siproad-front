import { useContext } from 'react'

import { Navigate } from 'react-router';

import { AuthContext } from '../../auth/context/AuthContext';

export const SiproadPublicRoute = ({ children }) => {

  // * hooks
  const { authState } = useContext(AuthContext);
  
  // * return component
  return (!authState.logged) ? children : <Navigate to="/" />;
}
