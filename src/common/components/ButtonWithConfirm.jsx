import React, { useState, useEffect, useId } from "react";

export const ButtonWithConfirm = ({ className, style, actionName, title, message, onExecute }) => {
  const modalId = useId();

  // * handle modal
  const [modal, setModal] = useState(null);

  useEffect(() => {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      setModal(new window.bootstrap.Modal(modalElement));
    }
  }, [modalId]);


  // * handles
  const handleConfirm = () => {
    onExecute();
    modal.hide();
  };


  return (
    <>
      {/* action button */}
      <button className={className} onClick={() => modal?.show()}>
        {actionName}
      </button>

      {/* modal */}
      <div className="modal fade" id={modalId} tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            {/* header */}
            <div className="modal-header bg-dark text-white">
              <h5 className="modal-title">{title}</h5>
              <button className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            
            {/* body */}
            <div className="modal-body bg-white text-dark">{message}</div>
            
            {/* footer */}
            <div className="modal-footer">
              <button className="btn btn-outline-danger px-3" data-bs-dismiss="modal">NO</button>
              <button className="btn btn-outline-success px-3" onClick={handleConfirm}>SI</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
