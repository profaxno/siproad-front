import { useState, useEffect, useId } from "react";

export const ButtonWithConfirm = ({ className, actionName, title, tooltip, message, onExecute, imgPath, imgStyle }) => {
  
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
    <>
      {/* action button */}
      <button className={className} onClick={() => modal?.show()} title={tooltip}>
        {imgPath && (
          <img
            src={imgPath}
            style={imgStyle}
          />
        )}
        {actionName}
      </button>

      {/* modal */}
      <div className="modal fade" id={modalId} tabIndex="-1">
        <div className="modal-dialog modal-sm modal-dialog-centered">
          <div className="modal-content">
            {/* header */}
            <div className="modal-header bg-dark text-white p-2">
              <h5 className="modal-title fs-6">{title}</h5>
              {/* <button className="btn-close btn-close-white" data-bs-dismiss="modal"></button> */}
            </div>
            
            {/* body */}
            <div className="modal-body bg-white text-dark text-center p-2">{message}</div>
            
            {/* footer */}
            <div className="modal-footer modal-sm p-2">
              <button className="btn btn-outline-danger" data-bs-dismiss="modal">NO</button>
              <button className="btn btn-outline-success" onClick={handleConfirm}>SI</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
