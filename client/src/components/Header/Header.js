import {Navbar} from "../Navbar/Navbar"
import styles from "./css/header.module.css"
import logoImg from "./images/logo.png"
import headerBg from "./images/header-bg.webp"
import { useState, useEffect, useContext } from "react"
import { authContext } from "../../contexts/authContext"
import {signal} from "@preact/signals-react"
import {UserMenu} from "./UserMenu/UserMenu"

export function Header(){
    const [currentScreenWidth, setCurrentScreenWidth] = useState(window.innerWidth)
    const [showNav, setShowNav] = useState(false)
    const {isAuth} = useContext(authContext)
    const toggleNav = () => setShowNav(currVal => !currVal)
    useEffect(() => {
        const handleResize = (e) => {
            setCurrentScreenWidth(e.target.innerWidth)
        }
        window.addEventListener('resize', (e) => handleResize(e))

        return () => {
            window.removeEventListener('resize', handleResize);
          };
    }, [currentScreenWidth])

     return(
        <>
       { currentScreenWidth >= 768
        ?   <header className={styles['site-header']}>
                <div className={styles['logo-container']}>
                    <img src={logoImg} className={styles.logo}/>
                </div>
                <Navbar isInResponsive={currentScreenWidth <= 768}/>
                {isAuth && <UserMenu />}
            </header>
        : <header className={styles['site-header-mob']}>
              <div className={styles['logo-container']}>
                <img src={logoImg} className={styles.logo}/>
             </div>
             {showNav &&  <div className={styles['nav-dropdown']}>
                <Navbar isInResponsive={currentScreenWidth <= 768}/>
             </div>
             }
             <button className={styles['bars-btn']} onClick={() => toggleNav()}>
                <svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512"><path opacity="1" fill="#1E3050" d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"/></svg>
             </button>
             {isAuth && <UserMenu />}
        </header>}
      </>
    )
}