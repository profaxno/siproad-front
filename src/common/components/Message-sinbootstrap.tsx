import type { FC } from "react";
import { useEffect, useState } from "react";
import { ScreenMessageInterface } from "../interfaces/screen-message.interface";
import { ScreenMessageTypeEnum } from "../enums/screen-message-type-enum";

type Props = {
  screenMessage: ScreenMessageInterface;
  onResetScreenMessage: () => void;
};

export const Message: FC<Props> = ({ screenMessage, onResetScreenMessage }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (screenMessage.show) {
      setShow(true);

      const timeout = setTimeout(() => {
        setShow(false);
        onResetScreenMessage();
      }, 3500);

      return () => clearTimeout(timeout);
    }
  }, [screenMessage]);

  if (!show) return null;

  return (
    <>
      {/* Fondo oscuro */}
      <div className="custom-backdrop" />
  
      {/* Modal */}
      <div className="modal show d-block" tabIndex={-1}>
        <div className="modal-dialog modal-sm">
          <div className="modal-content">
            {/* header */}
            <div
              className={`border rounded p-2 ${
                screenMessage.type === ScreenMessageTypeEnum.ERROR
                  ? "message-header-error"
                  : "message-header-success"
              }`}
            >
              <h5 className="modal-title fs-6">{screenMessage.title}</h5>
            </div>
  
            {/* body */}
            <div
              className={`modal-body text-center p-2 ${
                screenMessage.type === ScreenMessageTypeEnum.ERROR
                  ? "message-body-error"
                  : "message-body-success"
              }`}
            >
              {screenMessage.message}
            </div>
  
            {/* footer */}
            <div className="modal-footer modal-sm p-2" />
          </div>
        </div>
      </div>
    </>
  );  
};
