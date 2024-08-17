import {Outlet, useLocation } from "react-router-dom";
import { useNotifications } from "../../hooks/useNotifications";
import {useContext, useEffect} from "react";
import {notificationsContext} from "../../contexts/NotificationsContext";

export const RouteInterceptor = () => {
  const {removeError, removeSuccessMessage} = useNotifications()
  const location = useLocation()
  const {error, successMessage} = useContext(notificationsContext)

  useEffect(() => {
    if(error){
        removeError()
      }
    if(successMessage){
        removeSuccessMessage()
    }
  }, [location])

  return <Outlet />;
};