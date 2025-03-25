import React, { use, useEffect, useState } from 'react'
import { Message } from './Message'
import { useForm } from '../hooks/useForm'

export const ProductsProductForm = () => {

  const initObj = {
    username: '',
    email: '',
    password: ''
  }

  // * hook (customized) to handle the status form
  const {formState, onInputChange, onResetForm} = useForm(initObj);

  console.log('form rendering...'+ JSON.stringify(formState));

  // * return component
  return (
    <>
      <h1>Formulario simple con Hook personalizado</h1>
      <hr />

      <input 
        type="text" className="form-control" 
        placeholder="Nombre de usuario" 
        name="username" 
        value={formState.username}
        onChange={onInputChange}
      />

      <input 
        type="email" className="form-control mt-2" 
        placeholder="ivan@google.com" 
        name="email" 
        value={formState.email}
        onChange={onInputChange}
      />

      <input 
        type="password" className="form-control mt-2" 
        placeholder="**********" 
        name="password" 
        value={formState.password}
        onChange={onInputChange}
      />

      <button className="btn btn-primary mt-2" onClick={ onResetForm }>Cancelar</button>
    </>
  )
}
