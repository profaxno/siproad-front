import { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../auth/context/AuthContext';

export const SalesNavbar = () => {

  // * hooks
  
  // * handles
  
  // * return component
  return (
    <nav className="navbar navbar-expand-sm navbar bg-light py-0 px-3 border rounded">
        
      <div className="navbar-collapse">
        <div className="navbar-nav">
          <NavLink className={(args) => `nav-link ${args.isActive ? 'active' : ''}`} to="/sales/orders">Ordenes</NavLink>
          <NavLink className={(args) => `nav-link ${args.isActive ? 'active' : ''}`} to="/sales/customers">Clientes</NavLink>
        </div>
      </div>

    </nav>
  )
}