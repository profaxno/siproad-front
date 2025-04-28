import { useState, useContext, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import config from '../../config/app.config';

import { AuthContext } from '../context/AuthContext';
import { AuthForm, AuthFormErrors } from '../types';
import { LoginResponse } from '../types/login-response';

const initForm: AuthForm = {
  username: "",
  password: ""
};

export const LoginPage = () => {
  // * hooks
  const [form, setForm] = useState<AuthForm>(initForm);
  const [errors, setErrors] = useState<AuthFormErrors>({});
  const navigate = useNavigate();

  const context = useContext(AuthContext);
  if (!context) throw new Error("AuthContext must be used within AuthProvider");
  const { onLogin } = context;

  // * handles
  const validate = (): boolean => {
    
    const newErrors: AuthFormErrors = {};

    if (!form.username) newErrors.username = "Requerido";
    if (!form.password) newErrors.password = "Requerido";

    setErrors(newErrors);
    
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return;

    fetch(`${config.SIPROAD_LOGIN_HOST}/siproad-login/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": `${config.SIPROAD_LOGIN_API_KEY}`,
      },
      body: JSON.stringify(form),
    })
    .then( (response) => {

      if (!response.ok)
        throw new Error(`HTTP error: ${response.statusText}`);
      
      return response.json();
    })
    .then( (loginResponse: LoginResponse) => {

      if (loginResponse.internalCode === 401) {
        setErrors({ ...errors, login: "Usuario o contraseña incorrecto" });
        return;
      }

      if (loginResponse.internalCode !== 200) {
        setErrors({ ...errors, login: "Error validando credenciales, contacte al administrador del sistema." });
        return;
      }

      const { payload } = loginResponse;
              
      onLogin(payload?.user, payload?.company, payload?.token);
      navigate('/', { replace: true });

    })
    .catch( () => {
      setErrors({ ...errors, login: "Error validando credenciales, contacte al administrador del sistema." });
    });

  };

  return (
    <div className="d-flex vh-100 justify-content-center align-items-center">
      <div className="p-4 rounded shadow" style={{ width: "350px" }}>

        <div className="d-flex border rounded justify-content-center custom-bg-base p-3">
          <img src="/assets/siproad.png" alt="Logo" width="150" height="25" />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mt-4 mb-3">
            <label className="form-label">Usuario:</label>
            <input
              type="text"
              name="username"
              className={`form-control ${errors.username ? "is-invalid" : ""}`}
              placeholder="Ingrese su Email"
              onChange={handleChange}
            />
            {errors.username && <div className="custom-invalid-feedback">{errors.username}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Contraseña:</label>
            <input
              type="password"
              name="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              placeholder="Ingrese su Contraseña"
              onChange={handleChange}
            />
            {errors.password && <div className="custom-invalid-feedback">{errors.password}</div>}
          </div>

          <button type="submit" className="custom-btn-success w-100">Entrar</button>

          {errors.login && <div className="custom-invalid-feedback mt-3">{errors.login}</div>}
        </form>
        
      </div>
    </div>
  );
};
