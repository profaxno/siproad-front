import React, { useState } from 'react'
import { Modal, Button } from "react-bootstrap";

export const ConfirmationModal = ({show = false, onExecute}) => {
  const [showModal, setShowModal] = useState(show);

  const handleConfirm = () => {
    console.log("Acción confirmada");
    onExecute();
    setShowModal(false);
  };

  return (
    <div className="container mt-5">
      <Button variant="danger" onClick={() => setShowModal(true)}>
        Eliminar
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar acción</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Estás seguro de que deseas continuar?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleConfirm}>
            Sí, eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
