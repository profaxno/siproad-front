import type { FC } from "react";
import { useState, useEffect, useId } from "react";

import { Modal } from 'bootstrap';

import { ScreenMessageInterface } from "../interfaces/screen-message.interface"; // ajustá esta ruta según tu estructura
import { ScreenMessageTypeEnum } from "../enums/screen-message-type-enum";

type Props = {
  screenMessage: ScreenMessageInterface;
  onResetScreenMessage: () => void;
};

export const Message: FC<Props> = ({ screenMessage, onResetScreenMessage }) => {
  const [modal, setModal] = useState<Modal | null>(null);
  const modalId = useId();

  useEffect(() => {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      // setModal(new window.bootstrap.Modal(modalElement));
      setModal(new Modal(modalElement));
    }
  }, [modalId]);

  useEffect(() => {
    if (screenMessage.show) 
      showSuccessMessage();
  }, [screenMessage]);

  const showSuccessMessage = () => {
    modal?.show();

    setTimeout(() => {
      modal?.hide();
      onResetScreenMessage();
    }, 3500);
  };

  return (
    <div>
      {/* modal */}
      <div className="modal fade" id={modalId} tabIndex={-1}>
        <div className="modal-dialog modal-sm">
          <div className="modal-content">
            {/* header */}
            <div
              className={`border rounded p-2 ${
                screenMessage.type === ScreenMessageTypeEnum.ERROR ? "message-header-error" : "message-header-success"
              }`}
            >
              <h5 className="modal-title fs-6">{screenMessage.title}</h5>
            </div>

            {/* body */}
            <div
              className={`modal-body text-center p-2 ${
                screenMessage.type === ScreenMessageTypeEnum.ERROR ? "message-body-error" : "message-body-success"
              }`}
            >
              {screenMessage.message}
            </div>

            {/* footer */}
            <div className="modal-footer modal-sm p-2" />
          </div>
        </div>
      </div>
    </div>
  );
};
