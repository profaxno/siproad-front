import { useState, useEffect, useId } from "react";

export const ButtonWithConfirm = ({ className, actionName, title, tooltip, message, onExecute, imgClassName, imgPath, imgStyle }) => {
  
  // * hooks
  const [modal, setModal] = useState(null);
  const modalId = useId();

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
    <div>
      {/* action button */}
      <button className={className} onClick={() => modal?.show()} title={tooltip}>
        {actionName}
      </button>

      {/* modal */}
      <div className="modal fade" id={modalId} tabIndex="-1">
        <div className="modal-dialog modal-sm modal-dialog-centered">
          <div className="modal-content">
            
            {/* header */}
            <div className="border rounded p-2 message-header-success">
              <h5 className="modal-title fs-6">{title}</h5>
              {/* <button className="btn-close btn-close-white" data-bs-dismiss="modal"></button> */}
            </div>
            
            {/* body */}
            <div className="modal-body text-center p-2 message-body-success">{message}</div>
            
            {/* footer */}
            <div className="modal-footer modal-sm p-2">
              <button className="btn btn-outline-danger" data-bs-dismiss="modal">NO</button>
              <button className="custom-btn-outline-success" onClick={handleConfirm}>SI</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
