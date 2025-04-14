import { useContext, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../auth/context/AuthContext';
import { ButtonWithConfirm } from '../../common/components';

export const SiproadNavbar = () => {
  const { authState, onLogout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleNavbar = () => setIsCollapsed(!isCollapsed);
  const closeNavbar = () => setIsCollapsed(true); // Para cerrar después de click

  const handleLogout = () => {
    onLogout();
    navigate('/login', { replace: true });
  };

  return (
    <nav className="navbar navbar-expand-sm rounded px-3 custom-bg-base">
      <Link 
        className="navbar-brand" 
        to="/"
      >
        <img
          src={"/assets/siproad.png"}
          alt="Logo"
          width="100"
          height="17"
          // className="d-inline-block align-top me-2"
        />
        
      </Link>

      <button
        className="custom-navbar-toggler-icon d-sm-none"
        type="button"
        onClick={toggleNavbar}
        aria-controls="navbarSupportedContent"
        aria-expanded={!isCollapsed}
        aria-label="Toggle navigation"
      >
        {/* <span className="navbar-toggler-icon"></span> */}
      </button>

      <div className={`collapse navbar-collapse ${!isCollapsed ? 'show' : ''}`} id="navbarSupportedContent">
        {/* <label style={{ color: 'red' }}>MENU LARGE</label> */}

        <div className="navbar-nav me-auto d-none d-sm-block w-100">
          
          <div className="row">
            
            <div className="col-1 d-flex">
              <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''} custom-navlink-principal`} to="/sales">Ventas</NavLink>
              <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''} custom-navlink-principal`} to="/products">Productos</NavLink>
            </div>

            <div className="col-11 d-flex justify-content-end">
              
              <span className="nav-item nav-link text-light text-capitalize">
                {authState.user?.name.toLowerCase()}
              </span>

              <ButtonWithConfirm className={"custom-btn-outline-danger-logout"} title={"Confirmación"} message={"Salir del Sistema ¿Desea Continuar?"} tooltip={"Salir del Sistema"} onExecute={handleLogout}/>
            </div>

          </div>

        </div>

      
        <div className="navbar-nav me-auto d-sm-none">
          {/* <label style={{ color: 'red' }}>MENU SMALL</label> */}
          
          <NavLink className={(args) => `nav-link ${args.isActive ? 'active' : ''} custom-navlink-principal`} to="/sales/orders" onClick={closeNavbar}>Ordenes</NavLink>
          <NavLink className={(args) => `nav-link ${args.isActive ? 'active' : ''} custom-navlink-principal`} to="/sales/customers" onClick={closeNavbar}>Clientes</NavLink>  

          <NavLink className={(args) => `nav-link ${args.isActive ? 'active' : ''} custom-navlink-principal`} to="/products/products" onClick={closeNavbar}>Productos</NavLink>
          {/* <NavLink className={(args) => `nav-link ${args.isActive ? 'active' : ''}`} to="/products/elements" onClick={closeNavbar}>Elementos</NavLink> */}

          <ButtonWithConfirm className={"custom-btn-outline-danger-logout"} title={"Confirmación"} message={"Salir del Sistema ¿Desea Continuar?"} tooltip={"Salir del Sistema"} onExecute={handleLogout}/>
        </div>

      </div>
    </nav>
  );
};
