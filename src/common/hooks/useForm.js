import { useState } from 'react';

export const useForm = ( initObj = {} ) => {
  
  // const initObj = {
  //   username: '',
  //   email: '',
  //   password: ''
  // }

  
  // * hook (useState) to handle the status form
  const [formState, setFormState] = useState(initObj);

  // * method to handle the form
  const onInputChange = (event) => {
    
    // console.log(event.target.name);
    // console.log(event.target.value);
    
    const { target } = event;
    const { name, value } = target;
    
    console.log(`onInputChange: ${JSON.stringify({name, value})}`);

    setFormState({
      ...formState,
      [name]: value
    })
  }
  
  const onResetForm = () => {
    console.log(`onResetForm: ${JSON.stringify(initObj)}`);
    setFormState(initObj);
  }

  return {
    formState,
    onInputChange,
    onResetForm
  }  
}
 