import { useState } from "react";
import styles from "./css/sidebarSubmenu.module.css";

export function SidebarSubmenu({ selectedOption, onSelectSubmenuOption, selectedSubmenuOption, onHoverSubmenuOption }) {

  return (
    <div className={styles["options-container"]}>
      {selectedOption === "camp" ? (
        <ul className={`${styles["options-list"]} ${styles["camp-options"]}`}>
          <li
            onClick={(e) => onSelectSubmenuOption(e)}
            id="building"
            className={
              selectedSubmenuOption === "building"
                ? styles["option-active"]
                : styles.option
            }
          >
            Building
          </li>
          <li
            onClick={(e) => onSelectSubmenuOption(e)}
            id="crafting"
            className={
              selectedSubmenuOption === "crafting"
                ? styles["option-active"]
                : styles.option
            }
          >
            Crafting
          </li>
          <li
            onClick={(e) => onSelectSubmenuOption(e)}
            id="community"
            className={
              selectedSubmenuOption === "community"
                ? styles["option-active"]
                : styles.option
            }
          >
            Community
          </li>
        </ul>
      ) : (
        <ul className={`${styles["options-list"]} ${styles["map-options"]}`}>
          <li
            onClick={(e) => onSelectSubmenuOption(e)}
            onMouseOver={(e) => onHoverSubmenuOption(e)}
            onMouseLeave={() => onHoverSubmenuOption()}
            id="woods"
            className={
              selectedSubmenuOption === "woods"
                ? styles["option-active"]
                : styles.option
            }
          >
            Ascadia Woods
          </li>
          <li
            onClick={(e) => onSelectSubmenuOption(e)}
            onMouseOver={(e) => onHoverSubmenuOption(e)}
            onMouseLeave={() => onHoverSubmenuOption()}
            id="mountain"
            className={
              selectedSubmenuOption === "mountain"
                ? styles["option-active"]
                : styles.option
            }
          >
            Granton Mountains
          </li>
          <li
            onClick={(e) => onSelectSubmenuOption(e)}
            onMouseOver={(e) => onHoverSubmenuOption(e)}
            onMouseLeave={() => onHoverSubmenuOption()}
            id="river"
            className={
              selectedSubmenuOption === "river"
                ? styles["option-active"]
                : styles.option
            }
          >
            Sagell River
          </li>
          <li
            onClick={(e) => onSelectSubmenuOption(e)}
            onMouseOver={(e) => onHoverSubmenuOption(e)}
            onMouseLeave={() => onHoverSubmenuOption()}
            id="township"
            className={
              selectedSubmenuOption === "township"
                ? styles["option-active"]
                : styles.option
            }
          >
            St. Ivy Township
          </li>
          <li
            onClick={(e) => onSelectSubmenuOption(e)}
            onMouseOver={(e) => onHoverSubmenuOption(e)}
            onMouseLeave={() => onHoverSubmenuOption()}
            id="quarantine-zone"
            className={
              selectedSubmenuOption === "quarantine-zone"
                ? styles["option-active"]
                : styles.option
            }
          >
            Ruined Quarantine Zone
          </li>
          <li
            onClick={(e) => onSelectSubmenuOption(e)}
            onMouseOver={(e) => onHoverSubmenuOption(e)}
            onMouseLeave={() => onHoverSubmenuOption()}
            id="military-base"
            className={
              selectedSubmenuOption === "military-base"
                ? styles["option-active"]
                : styles.option
            }
          >
            Reynolds Military Base
          </li>
        </ul>
      )}
    </div>
  );
}
