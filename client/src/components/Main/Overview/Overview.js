import { useState } from "react";
import styles from "./css/overview.module.css";
import { Avatar } from "./Avatar/Avatar";
import { Inventory } from "./Inventory/Inventory";

export function Overview({ avatar, setError }) {
  const [selectedOption, setSelectedOption] = useState("inventory");

  return (
    <section className={styles["overview"]}>
      {selectedOption === "inventory" && (
        <div className={styles["inventory-content"]}>
          <Avatar avatar={avatar} setError={setError} />
          <Inventory setError={setError} />
        </div>
      )}
    </section>
  );
}
