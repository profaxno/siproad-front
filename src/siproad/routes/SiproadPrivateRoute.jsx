import { useContext } from 'react'

import { Navigate } from 'react-router';

import { AuthContext } from '../../auth/context/AuthContext';

export const SiproadPrivateRoute = ({ children }) => {

  // * hooks
  const { authState } = useContext(AuthContext);

  console.log(`authState: ${JSON.stringify(authState, null, 2)}`);

  // * return component
  return (authState.logged) ? children : <Navigate to="/login" />;
}
