import { useContext } from "react";
import { notificationsContext } from "../contexts/NotificationsContext";

export function useNotifications() {
  const {
    assignError,
    unassignError,
    assignSuccessMessage,
    unassignSuccessMessage,
  } = useContext(notificationsContext);

  const setNewError = (error) => {
    assignError(error);
  };

  const removeError = () => {
    unassignError();
  };

  const setNewSuccessMessage = (message) => {
    assignSuccessMessage(message);
  };

  const removeSuccessMessage = () => unassignSuccessMessage();

  return {
    setNewError,
    removeError,
    setNewSuccessMessage,
    removeSuccessMessage,
  };
}
