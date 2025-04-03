import React, { useState, useEffect, useId } from "react";

export const Message = ({show, onUpdateShowMessage}) => {
  
  // * hooks
  const [modal, setModal] = useState(null);
  const modalId = useId();

  console.log(`rendered: show=${show}`);

  useEffect(() => {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      setModal(new window.bootstrap.Modal(modalElement));
    }
  }, [modalId]);

  useEffect(() => {
    console.log(`useEffect: show=${show}`);
    if(show)
      showSuccessMessage();
  }, [show]);

  // * handles
  const showSuccessMessage = () => {
    modal?.show();

    setTimeout(() => {
      modal.hide();
      onUpdateShowMessage(false);
    }, 3000);
  };

  return (
    <div>
      {/* <button onClick={showSuccessMessage}>Mostrar mensaje</button> */}

      {/* ToastContainer para mostrar el toast */}
      <div className="modal fade" id={modalId} tabIndex="-1">
        <div className="modal-dialog modal-sm">
          <div className="modal-content">
            {/* header */}
            <div className="modal-header bg-success text-white p-2">
              <h5 className="modal-title fs-6">Información</h5>
              {/* <button className="btn-close btn-close-white" data-bs-dismiss="modal"></button> */}
            </div>
            
            {/* body */}
            <div className="modal-body bg-white text-dark text-center p-2">Operacion Exitosa!</div>
            
            {/* footer */}
            <div className="modal-footer modal-sm p-2">
              {/* <button className="btn btn-outline-danger" data-bs-dismiss="modal">NO</button> */}
              {/* <button className="btn btn-outline-success">OK</button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};