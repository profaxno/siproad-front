import type { FC } from 'react';
import { NavLink } from 'react-router-dom';

export const ProductsNavbar: FC = () => {

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