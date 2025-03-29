import { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../auth/context/AuthContext';

export const ProductsNavbar = () => {

  // * hooks
  
  // * handles
  
  // * return component
  return (
    <nav className="navbar navbar-expand-sm navbar bg-light py-1 px-3 border rounded">
        
      <div className="navbar-collapse">
        <div className="navbar-nav">
          <NavLink className={(args) => `nav-link ${args.isActive ? 'active' : ''}`} to="/products/products">Productos</NavLink>
          <NavLink className={(args) => `nav-link ${args.isActive ? 'active' : ''}`} to="/products/elements">Ingredientes</NavLink>
        </div>
      </div>

    </nav>
  )
}