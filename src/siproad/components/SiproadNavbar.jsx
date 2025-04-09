import { useContext, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../auth/context/AuthContext';
import { SalesNavbar } from '../../sales/components/SalesNavbar';
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
    <nav className="navbar navbar-expand-sm navbar-dark bg-dark py-1 px-3 border rounded">
      <Link className="navbar-brand" to="/">SIPROAD</Link>

      <button
        className="navbar-toggler p-1"
        type="button"
        onClick={toggleNavbar}
        aria-controls="navbarSupportedContent"
        aria-expanded={!isCollapsed}
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className={`collapse navbar-collapse ${!isCollapsed ? 'show' : ''}`} id="navbarSupportedContent">
        {/* <label style={{ color: 'red' }}>MENU LARGE</label> */}

        <div className="navbar-nav me-auto d-none d-sm-block w-100">
          
          <div className="row">
            
            <div className="col-1 d-flex">
              <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/sales">Ventas</NavLink>
              <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/products">Productos</NavLink>
            </div>

            <div className="col-11 d-flex justify-content-end">
              
              <span className="nav-item nav-link text-light text-capitalize">
                {authState.user?.name.toLowerCase()}
              </span>

              <ButtonWithConfirm className={"btn btn-sm"} title={"Confirmación"} message={"Salir del Sistema ¿Desea Continuar?"} tooltip={"Salir del Sistema"} onExecute={handleLogout} imgPath={'/assets/logout-red.png'} imgStyle={{ width: "20px", height: "20px" }}/>
              {/* <button className="nav-item nav-link btn" onClick={() => { handleLogout() }}>Salir</button> */}
            </div>

          </div>

        </div>

      
        <div className="navbar-nav me-auto d-sm-none">
          {/* <label style={{ color: 'red' }}>MENU SMALL</label> */}
          
          <NavLink className={(args) => `nav-link ${args.isActive ? 'active' : ''}`} to="/sales/orders" onClick={closeNavbar}>Órdenes</NavLink>
          <NavLink className={(args) => `nav-link ${args.isActive ? 'active' : ''}`} to="/sales/customers" onClick={closeNavbar}>Clientes</NavLink>  

          <NavLink className={(args) => `nav-link ${args.isActive ? 'active' : ''}`} to="/products/products" onClick={closeNavbar}>Productos</NavLink>
          <NavLink className={(args) => `nav-link ${args.isActive ? 'active' : ''}`} to="/products/elements" onClick={closeNavbar}>Ingredientes</NavLink>

          <ButtonWithConfirm className={"btn btn-sm"} title={"Confirmación"} message={"Salir del Sistema ¿Desea Continuar?"} tooltip={"Salir del Sistema"} onExecute={handleLogout} imgPath={'/assets/logout-red.png'} imgStyle={{ width: "20px", height: "20px" }}/>
          {/* <button className="nav-item nav-link btn" onClick={() => { handleLogout() }}>Salir</button> */}
        </div>
        
      </div>
    </nav>
  );
};
