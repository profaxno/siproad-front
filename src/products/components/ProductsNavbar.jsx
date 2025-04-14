import { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../auth/context/AuthContext';

export const ProductsNavbar = () => {

  // * hooks
  
  // * handles
  
  // * return component
  return (
    <nav className="navbar navbar-expand-sm border rounded custom-bg-secondary py-0 d-none d-sm-block">
      <div className="navbar-nav">
        <NavLink className={(args) => `nav-link ${args.isActive ? 'active' : ''} custom-navlink-secondary`} to="/products/products">Productos</NavLink>
        {/* <NavLink className={(args) => `nav-link ${args.isActive ? 'active' : ''}`} to="/products/elements">Elementos</NavLink> */}
      </div>
    </nav>
  )
}