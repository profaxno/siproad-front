import { FC } from 'react';
import '../styles/status-bar.css';

type StatusBarProps = {
  statusList: string[];
  currentStatus: string;
};

export const StatusBar: FC<StatusBarProps> = ({ statusList, currentStatus }) => {
  return (
    <div className="statusbar-container">
      {
        statusList.map((status, index) => {
          const isActive = status === currentStatus;
          
          return (
            <div key={status} className="statusbar-step-container">
              <div className={`statusbar-step ${isActive ? 'active' : 'inactive'}`}>
                {status.toUpperCase()}
              </div>
              {index < statusList.length - 1 && <div className="statusbar-linea" />}
            </div>
          );
        })
      }
    </div>
  );
};
