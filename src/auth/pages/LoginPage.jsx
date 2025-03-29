import { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const LoginPage = () => {

  // * hooks
  const { onLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  // * handles
  const handleLogin = () => {
    console.log('Login clicked');
    
    onLogin('Ivan Perez', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55SWQiOiJlNDA3MDA2My1iZDA5LTQ5OTMtOWFiMC1iZjBiN2Y1ZDY3ODUiLCJpZCI6IjNmMWY3ZTc3LTJhNDktNDUzNy1iZWI5LTYyMTFkNTE2ZTI5MyIsImlhdCI6MTc0MzI3MjY2MywiZXhwIjoxNzQzMzAxNDYzfQ.-8Y8u-8O-R_bqAM96DTVzmifbYNGC22uJ7Ql-75_AvM');

    navigate('/', {
      replace: true
    });

  }

  // * return component
  return (
    <div className="container mt-5">
      <h1>Login</h1>
      <hr />

      <button
        className="btn btn-primary"
        onClick={handleLogin}
      >
        Login
      </button>
    </div>
  )
}
