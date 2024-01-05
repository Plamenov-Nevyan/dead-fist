import {Navbar} from "../Navbar/Navbar"
import styles from "./css/header.module.css"
import logoImg from "./images/logo.png"
import headerBg from "./images/header-bg.webp"

export function Header(){

    return(
        <header className={styles['site-header']}>
            <div className={styles["header-bg"]}>
                <img src={headerBg} className={styles["header-bg-img"]}/>
            </div>
            <div className={styles['logo-container']}>
                <img src={logoImg} className={styles.logo}/>
            </div>
            <Navbar />
        </header>
    )
}