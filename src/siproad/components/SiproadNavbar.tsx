import { useContext, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../auth/context/AuthContext';
import { ButtonWithConfirm } from '../../common/components';

export const SiproadNavbar = () => {
  
  const context = useContext(AuthContext);
  if (!context) 
    throw new Error("AuthContext must be used within an AuthProvider");

  const { authState, onLogout } = context;
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);

  const toggleNavbar = () => setIsCollapsed(!isCollapsed);
  const closeNavbar = () => setIsCollapsed(true);

  const handleLogout = () => {
    onLogout();
    navigate('/login', { replace: true });
  };

  return (
    <nav className="navbar navbar-expand-sm rounded px-3 custom-bg-base">
      <Link to="/">
        <img
          src="/assets/siproad.png"
          alt="Logo"
          width="105"
          height="18"
          className="align-top me-3"
        />
      </Link>

      <button
        className="custom-navbar-toggler-icon d-sm-none"
        type="button"
        onClick={toggleNavbar}
        aria-controls="navbarSupportedContent"
        aria-expanded={!isCollapsed}
        aria-label="Toggle navigation"
      ></button>

      <div
        className={`collapse navbar-collapse ${!isCollapsed ? 'show' : ''}`}
        id="navbarSupportedContent"
      >
        {/* Menu grande */}
        <div className="navbar-nav me-auto d-none d-sm-block w-100">
          <div className="row">
            <div className="col-1 d-flex">
              <NavLink
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''} custom-navlink-principal`
                }
                to="/sales"
              >
                Ventas
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''} custom-navlink-principal`
                }
                to="/products"
              >
                Productos
              </NavLink>
            </div>

            <div className="col-11 d-flex justify-content-end">
              <span className="nav-item nav-link text-light text-capitalize">
                {`${authState.company.fantasyName?.toLowerCase()}, ${authState.user.name?.toLowerCase()}`}
              </span>

              <ButtonWithConfirm
                className="custom-btn-outline-danger-logout"
                title="Confirmación"
                message="Salir del Sistema ¿Desea Continuar?"
                tooltip="Salir del Sistema"
                onExecute={handleLogout}
              />
            </div>
          </div>
        </div>

        {/* Menu chico */}
        <div className="navbar-nav me-auto d-sm-none">
          <NavLink
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''} custom-navlink-principal`
            }
            to="/sales/orders"
            onClick={closeNavbar}
          >
            Ordenes
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''} custom-navlink-principal`
            }
            to="/sales/customers"
            onClick={closeNavbar}
          >
            Clientes
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''} custom-navlink-principal`
            }
            to="/products/products"
            onClick={closeNavbar}
          >
            Productos
          </NavLink>

          <ButtonWithConfirm
            className="custom-btn-outline-danger-logout"
            title="Confirmación"
            message="Salir del Sistema ¿Desea Continuar?"
            tooltip="Salir del Sistema"
            onExecute={handleLogout}
          />
        </div>
      </div>
    </nav>
  );
};
