import { NavLink } from 'react-router-dom';

export const SalesNavbar = () => {
  return (
    <nav className="navbar navbar-expand-sm border rounded custom-bg-secondary py-0 d-none d-sm-block ">
      <div className="navbar-nav">
        <NavLink className={(args) => `nav-link ${args.isActive ? 'active' : ''} custom-navlink-secondary`} to="/sales/orders">Ordenes</NavLink>
        <NavLink className={(args) => `nav-link ${args.isActive ? 'active' : ''} custom-navlink-secondary`} to="/sales/customers">Clientes</NavLink>
      </div>
    </nav>
  );
};