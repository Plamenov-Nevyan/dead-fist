import styles from "./css/spinnerMain.module.css";

export function LoadingSpinnerMain({ positions }) {
  return (
    <div
      className={styles["lds-spinner"]}
      style={{ top: positions.top, left: positions.left }}
    >
      <div className={styles.inner}></div>
      <div className={styles.inner}></div>
      <div className={styles.inner}></div>
      <div className={styles.inner}></div>
      <div className={styles.inner}></div>
      <div className={styles.inner}></div>
      <div className={styles.inner}></div>
      <div className={styles.inner}></div>
      <div className={styles.inner}></div>
      <div className={styles.inner}></div>
      <div className={styles.inner}></div>
      <div className={styles.inner}></div>
    </div>
  );
}
