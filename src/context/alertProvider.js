/* eslint-disable react/prop-types */
import { createContext, useState, useContext } from "react";

// 创建一个 AlertContext
const AlertContext = createContext();

const alertTypeIcon = {
  success: {
    icon: "bi-check-circle",
  },
  info: {
    icon: "bi-info-circle",
  },
  danger: {
    icon: "bi-exclamation-circle",
  },
};

// 创建一个自定义的 Hook 以便其他组件可以更方便地使用 AlertContext
export const useAlert = () => {
  return useContext(AlertContext);
};

// 创建 AlertProvider 组件
export const AlertProvider = ({ children }) => {
  console.log("in");
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  const showAlert = ({ message, type = "success" }) => {
    setAlertMessage(message);
    setAlertType(type);
    setAlertVisible(true);

    setTimeout(() => {
      setAlertVisible(false);
    }, 2000);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alertVisible && (
        <div className={`alert alert-${alertType} alertbox`} role="alert">
          <i className={`bi ${alertTypeIcon[alertType].icon} mr-1`}></i>
          {alertMessage}
        </div>
      )}
    </AlertContext.Provider>
  );
};
