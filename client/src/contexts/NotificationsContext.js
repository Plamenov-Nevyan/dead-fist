import { createContext, useState } from "react";

const notificationsContext = createContext();

const NotificationsProvider = ({ children }) => {
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState('')

  const assignError = (message) => {
    setError(message)
  }

  const unassignError = () => {
    setError(() => '')
  }

  const assignSuccessMessage = (message) => {
    setSuccessMessage(message)
  }

  const unassignSuccessMessage = () => setSuccessMessage('')

  return (
    <notificationsContext.Provider value={{ error, assignError, unassignError, successMessage, assignSuccessMessage, unassignSuccessMessage }}>
      {children}
    </notificationsContext.Provider>
  );
};

export { notificationsContext, NotificationsProvider };
