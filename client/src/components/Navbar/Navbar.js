import styles from "./css/navbar.module.css"
import { NavLink } from "react-router-dom"

export function Navbar({isInResponsive}){
    return(
        <nav className={isInResponsive ? styles['main-nav-mob'] : styles['main-nav']}>
            <ul className={isInResponsive ? styles['nav-links-mob'] : styles['nav-links']}>
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