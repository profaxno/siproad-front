import React, { useState, useEffect, useId } from "react";

export const Message = ({screenMessage, onResetScreenMessage}) => {
  
  // * hooks
  const [modal, setModal] = useState(null);
  const modalId = useId();

  // console.log(`rendered: show=${show}`);

  useEffect(() => {
    const modalElement = document.getElementById(modalId);
    if (modalElement)
      setModal(new window.bootstrap.Modal(modalElement));
  }, [modalId]);

  useEffect(() => {
    if(screenMessage.show)
      showSuccessMessage();
  }, [screenMessage]);


  // * handles
  const showSuccessMessage = () => {
    modal?.show();

    setTimeout(() => {
      modal.hide();
      onResetScreenMessage();
    }, 3500);
  };

  
  return (
    <div>
      {/* modal */}
      <div className="modal fade" id={modalId} tabIndex="-1">
        <div className="modal-dialog modal-sm">
          
          <div className="modal-content">

            {/* header */}
            <div className={`border rounded p-2 ${screenMessage.type == "error" ? "message-header-error" : "message-header-success"}`}>
              <h5 className="modal-title fs-6">{screenMessage.title}</h5>
            </div>
            
            {/* body */}
            <div className={`modal-body text-center p-2 ${screenMessage.type == "error" ? "message-body-error" : "message-body-success"}`}>
              {screenMessage.message}
            </div>

            {/* footer */}
            <div className="modal-footer modal-sm p-2"/>

          </div>

        </div>
      </div>
    </div>
  );
};