import { useState, useEffect, useContext } from "react";
import styles from "./css/main.module.css";
import { Overview } from "./Overview/Overview";
// import sidebarBg from "../../assets/sidebar-bg.png";
import { SidebarSubmenu } from "./SidebarSubmenu/SidebarSubmenu";
// import campOptBg from "../../assets/camp-option-bg.png";
// import mapOptBg from "../../assets/map-option-bg.png";
import { GlobalMap } from "./GlobalMap/GlobalMap";
import { useCharacterData } from "../../hooks/useCharacterData";
import { LoadingSpinnerMain } from "../Spinners/LoadingSpinnerMain";
import { useNotifications } from "../../hooks/useNotifications";
import { ErrorNotification } from "../Notifications/ErrorNotification/ErrorNotification";
import { notificationsContext } from "../../contexts/NotificationsContext";

export function Main() {
  const [selectedOption, setSelectedOption] = useState("overview");
  const [selectedSubmenuOption, setSelectedSubmenuOption] = useState("");
  const [hoveredSubmenuOption, setHoveredSubmenuOption] = useState("");
  const [campOrMap, setCampOrMap] = useState("camp");
  const [showMap, setShowMap] = useState(false);
  const { charData, setCharData } = useCharacterData();
  const { setNewError } = useNotifications();
  const { error } = useContext(notificationsContext);

  const onSelectOption = (e) =>
    setSelectedOption((currSelected) => e.target.id);
  const onSetCampOrMapMenu = (e) => setCampOrMap(e.currentTarget.id);
  const onShowMap = (e) => {
    setSelectedOption(e.currentTarget.id);
    setShowMap((currVal) => !currVal);
  };
  const onSelectSubmenuOption = (e) =>
    setSelectedSubmenuOption(e.currentTarget.id);

  const onHoverSubmenuOption = (e) => {
    if (e) {
      setHoveredSubmenuOption(e.currentTarget.id);
    } else {
      setHoveredSubmenuOption("");
    }
  };

  const setError = (err) => {
    setNewError(err.message);
  };

  return (
    <>
      {error && <ErrorNotification />}
      <main className={styles.main}>
        <section className={styles.content}>
          <div className={styles["sidebar-content"]}>
            <img
              src="https://i.imgur.com/jqGRjO0.png"
              className={styles["sidebar-bg"]}
            />
            <ul className={styles["sidebar-options"]}>
              <li
                className={
                  selectedOption === "overview"
                    ? styles["option-active"]
                    : styles.option
                }
                onClick={(e) => onSelectOption(e)}
                id="overview"
              >
                Overview
              </li>
              <li
                className={
                  selectedOption === "statistics"
                    ? styles["option-active"]
                    : styles.option
                }
                onClick={(e) => onSelectOption(e)}
                id="statistics"
              >
                Statistics
              </li>
            </ul>
            <div className={styles["sidebar-submenu"]}>
              <div className={styles["sb-submenu-options"]}>
                <div
                  onMouseOver={(e) => onSetCampOrMapMenu(e)}
                  onClick={(e) => onShowMap(e)}
                  id="camp"
                  className={
                    campOrMap === "camp"
                      ? styles["camp-option-active"]
                      : styles["camp-option"]
                  }
                >
                  <img
                    src="https://i.imgur.com/uxLCnl9.png"
                    className={styles["camp-opt-bg"]}
                  />
                </div>
                <div
                  onMouseOver={(e) => onSetCampOrMapMenu(e)}
                  onClick={(e) => onShowMap(e)}
                  id="map"
                  className={
                    campOrMap === "map"
                      ? styles["map-option-active"]
                      : styles["map-option"]
                  }
                >
                  <img
                    src="https://i.imgur.com/HPYklxy.png"
                    className={styles["map-opt-bg"]}
                  />
                </div>
              </div>
              <SidebarSubmenu
                selectedOption={campOrMap}
                onSelectSubmenuOption={onSelectSubmenuOption}
                selectedSubmenuOption={selectedSubmenuOption}
                onHoverSubmenuOption={onHoverSubmenuOption}
              />
            </div>
          </div>
          <div className={styles["option-content"]}>
            {selectedOption === "overview" &&
            Object.entries(charData).length > 0 ? (
              <Overview
                avatar={charData.avatar}
                setError={setError}
              />
            ) : (
              <LoadingSpinnerMain positions={{ top: "50%", left: "45%" }} />
            )}
            {selectedOption === "map" && showMap && (
              <GlobalMap hoveredSubmenuOption={hoveredSubmenuOption} />
            )}
            {/* {selectedOption === 'camp' &&} */}
          </div>
        </section>
      </main>
    </>
  );
}
