import styles from "./css/mapTooltip.module.css";

export function MapTooltip({
  thumbnail,
  text,
  locationName,
  foundableItems,
  locationDangerLevel,
}) {
  return (
    <div
      className={
        locationName === "Reynolds Military Base"
          ? `${styles.container} ${styles["container-military-base"]}`
          : locationName === "St. Ivy Township"
          ? `${styles.container} ${styles["container-township"]}`
          : styles.container
      }
    >
      <div className={styles["thumbnail-container"]}>
        <img src={thumbnail} className={styles["thumbnail"]} />
      </div>
      <div className={styles["text-container"]}>
        <h3 className={styles.heading}>{locationName}</h3>
        <p className={styles.text}>{text}</p>
      </div>
      <div className={styles["location-info"]}>
        <h4 className={styles["foundable-heading"]}>Here you can find:</h4>
        <ul className={styles["foundable-items"]}>
          {foundableItems.map((itemDescr) => (
            <li className={styles.item}>{itemDescr}</li>
          ))}
        </ul>
      </div>
      <div className={styles["danger-level"]}>
        <h3 className={styles["danger-heading"]}>
          Danger level:
          <span
            className={
              locationDangerLevel === "Extreme"
                ? styles["danger-extreme"]
                : locationDangerLevel === "Hard"
                ? styles["danger-hard"]
                : locationDangerLevel === "Normal"
                ? styles["danger-normal"]
                : styles["danger-safe"]
            }
          >
            {locationDangerLevel}
          </span>
        </h3>
      </div>
    </div>
  );
}
