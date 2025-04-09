import { NavLink } from 'react-router-dom';

export const SalesNavbar = () => {
  return (
    <nav className="navbar navbar-expand-sm bg-light py-0 border rounded d-none d-sm-block">
      <div className="navbar-nav">
        <NavLink className={(args) => `nav-link ${args.isActive ? 'active' : ''}`} to="/sales/orders">Órdenes</NavLink>
        <NavLink className={(args) => `nav-link ${args.isActive ? 'active' : ''}`} to="/sales/customers">Clientes</NavLink>
      </div>
    </nav>
  );
};