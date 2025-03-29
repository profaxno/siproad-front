import { useContext } from 'react';

import { Link, NavLink, useNavigate } from 'react-router-dom';

import { AuthContext } from '../../auth/context/AuthContext';

export const SiproadNavbar = () => {

  // * hooks
  const { authState, onLogout } = useContext(AuthContext);
  const navigate = useNavigate();

  // * handles
  const handleLogout = () => {
    onLogout();
    
    navigate('/login', {
      replace: true
    })
  }

  // * return component
  return (
    // <nav className="navbar navbar-expand-sm navbar-dark bg-dark p-3">
    <nav className="navbar navbar-expand-sm navbar-dark bg-dark py-1 px-3 border rounded">


      <Link className="navbar-brand" to="/">SIPROAD</Link>

      <div className="navbar-collapse">
        <div className="navbar-nav">
          <NavLink className={(args) => `nav-link ${args.isActive ? 'active' : ''}`} to="/sales">Ventas</NavLink>
          <NavLink className={(args) => `nav-link ${args.isActive ? 'active' : ''}`} to="/products">Productos</NavLink>
          <NavLink className={(args) => `nav-link ${args.isActive ? 'active' : ''}`} to="/admin">Administración</NavLink>
        </div>
      </div>

      <div className="navbar-collapse collapse w-100 order-3 dual-collapse2 d-flex justify-content-end">
        <ul className="navbar-nav ml-auto">
          <span className="nav-item nav-link text-info">{authState.user?.name}</span>
          <button className="nav-item nav-link btn" onClick={handleLogout}>Salir</button>
        </ul>
      </div>

    </nav>
  )
}