import styles from "./css/userMenu.module.css"
import { getSessionInfo, logOut } from "../../../services/authServices"
import {useEffect, useState, useContext} from "react"
import { notificationsContext } from "../../../contexts/NotificationsContext"
import {ErrorNotification} from "../../Notifications/ErrorNotification/ErrorNotification"
import { useNotifications } from "../../../hooks/useNotifications"
import {useNavigate} from "react-router-dom"

export function UserMenu(){
    const [profilePic, setProfilePic] = useState('')
    const [showOptions, setShowOptions] = useState(false)
    const { error } = useContext(notificationsContext);
    const { setNewError } = useNotifications();
    const navigate  = useNavigate()

    useEffect(() => {
      setTimeout(() => {
        getSessionInfo('profile_picture')
        .then(async (resp) => {
            let data = await resp.json()
            if(!resp.ok){
                return setNewError(data.message)
            }else {
                setProfilePic(data.profile_picture)
            }
        })
        .catch(err => {
            setNewError(err.message)
        })
      }, 4000)
    },[])

    const onShowOptions = () => {
        setShowOptions(currVal => !currVal)
    }

    const onLogOut = async () => {
        try {
            let resp = await logOut()
            let data = await resp.json()
            if(!resp.ok){
               return setNewError(data.message)
            }
            navigate('/')
        }catch(err){
            setNewError(err.message)
        }
    }

    return (
        <>
        {error && <ErrorNotification />}
        <div className={styles['menu-btn']} onClick={() => onShowOptions()}>
            <img src={profilePic} className={styles['profile-picture']}/>
           {showOptions &&  <div className={styles['options-menu']}>
                <ul className={styles['options']}>
                    <li onClick={() => onLogOut()} className={styles['option']}>
                        Logout
                    </li>
                </ul>
            </div>
            }
        </div>
        </>
    )
}