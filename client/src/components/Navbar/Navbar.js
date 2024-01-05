import styles from "./css/navbar.module.css"
import { NavLink } from "react-router-dom"

export function Navbar(){
    
    return(
        <nav className={styles['main-nav']}>
            <ul className={styles['nav-links']}>
            <NavLink
              to={"/"}
              className={({ isActive }) =>
                isActive ? styles["active-link"] : styles["nav-link"]
              }
            >
              Home
            </NavLink>
            <NavLink
              to={"/login"}
              className={({ isActive }) =>
                isActive ? styles["active-link"] : styles["nav-link"]
              }
            >
              Login
            </NavLink>
            <NavLink
              to={"/register"}
              className={({ isActive }) =>
                isActive ? styles["active-link"] : styles["nav-link"]
              }
            >
              Sign Up
            </NavLink>
            </ul>
        </nav>
    )
}