import React, { useReducer } from 'react'

import { AuthContext } from './AuthContext'
import { authReducer } from './authReducer'
import { types } from '../types/types'

const init = () => {
  const session = JSON.parse( localStorage.getItem('session') );
  
  return {
    logged: !!session,
    user: session?.user,
    company: session?.company,
    token: session?.token
  }
}

export const AuthProvider = ({ children }) => {

  // * hooks
  const [authState, dispatch] = useReducer( authReducer, {}, init );

  // * handles
  const onLogin = ( name = '', company, token ) => {
    const user = { name };
    const session = { user, company, token };

    const action = {
      type: types.login,
      payload: {
        user,
        company,
        token
      }
    }

    localStorage.setItem('session', JSON.stringify(session) );
    dispatch( action );
  }

  const onLogout = () => {
    localStorage.removeItem('session');
    dispatch({ type: types.logout });
  }

  // * return component
  return (
    <AuthContext.Provider value={{ authState, onLogin: onLogin, onLogout: onLogout }}>
      {children}
    </AuthContext.Provider>
  )
}
