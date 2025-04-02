import React, { useState, useEffect } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

export const Message = ({show, onUpdateShowMessage}) => {
  
  // * hooks
  const [showToast, setShowToast] = useState(show);
  
  console.log(`Message: showToast=${showToast}, show=${show}`);

  useEffect(() => {
    console.log(`Message: useEffect... showToast=${showToast}, show=${show}`);
    if(show)
      showSuccessMessage();
  }, [show]);

  // * handles
  const showSuccessMessage = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      onUpdateShowMessage(false);
    }, 3000);
  };

  return (
    <div>
      {/* <button onClick={showSuccessMessage}>Mostrar mensaje</button> */}

      {/* ToastContainer para mostrar el toast */}
      <ToastContainer position="top-center" className="p-5">
        <Toast show={showToast} onClose={() => setShowToast(false)}>
          
          <Toast.Header className="bg-success text-white">
            <strong className="me-auto">¡Éxito!</strong>
          </Toast.Header>

          <Toast.Body >Operación exitosa</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};