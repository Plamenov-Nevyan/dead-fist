import { useContext, useState, useEffect } from "react";
import { notificationsContext } from "../../../contexts/NotificationsContext";
import { useNotifications } from "../../../hooks/useNotifications";
import styles from "./errorNotification.module.css";

export function ErrorNotification() {
  const { removeError } = useNotifications();
  const { error } = useContext(notificationsContext);
  const [isSticky, setIsSticky] = useState(false)

  useEffect(() => {
    const onScroll = () => {
        const scrollY = window.scrollY || window.pageYOffset
        setIsSticky(scrollY > 100)
    }

    window.addEventListener('scroll', onScroll)

    return () => {
        window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <div className={`${styles["error-notification"]} ${isSticky ? styles['error-notification-sticky'] : ''}`}>
      <p className={styles.message}>{error}</p>
      <button onClick={() => removeError()} className={styles.dismiss}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
          <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
        </svg>
      </button>
    </div>
  );
}
