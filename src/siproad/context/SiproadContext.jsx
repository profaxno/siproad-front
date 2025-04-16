// src/common/context/ErrorContext.tsx
import { createContext, useState } from "react";

export const SiproadContext = createContext();

const initScreenMessage = {
  type    : "", // "success", "error", "info"
  title   : "",
  message : "",
  show    : false
}

export const SiproadProvider = ({ children }) => {
  const [screenMessage, setScreenMessage] = useState(initScreenMessage);

  const resetScreenMessage = () => {
    setScreenMessage(initScreenMessage);
  } 

  return (
    <SiproadContext.Provider 
      value={{ 
        screenMessage, 
        setScreenMessage, 
        resetScreenMessage 
      }}>
      {children}
    </SiproadContext.Provider>
  );
};
