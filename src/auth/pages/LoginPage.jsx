import { useState, useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

import config from '../../config/app.config';

const initObj = {
  username: null,
  password: null
}

export const LoginPage = () => {

  // * hooks
  const [form, setForm] = useState(initObj)
  const [errors, setErrors] = useState({});
  const { onLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  // * handles
  const validate = () => {
    let newErrors = {};

    if (!form.username) newErrors.username = "Requerido";
    if (!form.password) newErrors.password = "Requerido";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: "" });
  }

  const handleSubmit = async(e) => {
    e.preventDefault();

    // * validate fields
    if(!validate()) return;
    
    try{
      // * requesto to login api
      const response = await fetch(`${config.SIPROAD_LOGIN_HOST}/siproad-login/auth/login`, { //"http://localhost:3004/siproad-login/auth/login"
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      // * validate response
      if (!response.ok) {
        throw new Error("response error", response.statusText);
      }

      const data = await response.json();
      if(data.internalCode === 401) {
        setErrors({ ...errors, login: "Usuario o contraseña incorrectos" });
        return;
      }

      if(data.internalCode != 200) {
        setErrors({ ...errors, login: "Error validando credenciales, contacte al administrador del sistema." });
        return;
      }

      console.log(data);
      if(data.internalCode == 200) {
        const { payload } = data;
        const { user, token } = payload;
        
        onLogin(user.name, token);
        navigate('/', { replace: true });
      }

    } catch(error) {
      setErrors({ ...errors, login: "Error general validando credenciales, contacte al administrador del sistema." });
      //console.log(error);
    }

  }

  // * return component
  return (
    <div className="d-flex vh-100 justify-content-center align-items-center bg-light">
      <div className="p-4 rounded shadow bg-white" style={{ width: "350px" }}>
        
        <h3 className="text-center mb-4">Login</h3>
        <hr/>

        <form onSubmit={handleSubmit}>
          <div className="mt-4 mb-3">
            <label className="form-label">Usuario:</label>
            <input name="username" type="text" className={`form-control ${errors.username ? "is-invalid" : ""}`} placeholder="Ingrese su Email"  onChange={handleChange}/>
            {errors.username && <div className="custom-invalid-feedback">{errors.username}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Contraseña:</label>
            <input name="password" type="password" className={`form-control ${errors.password ? "is-invalid" : ""}`} placeholder="Ingrese su Contraseña" onChange={handleChange}/>
            {errors.password && <div className="custom-invalid-feedback">{errors.password}</div>}
          </div>

          <button type="submit" className="btn btn-success w-100">Entrar</button>

          {errors.login && <div className="custom-invalid-feedback mt-3">{errors.login}</div>}
        </form>

      </div>
    </div>
  )
}
