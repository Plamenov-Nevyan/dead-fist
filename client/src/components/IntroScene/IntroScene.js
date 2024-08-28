import {useEffect, useState, useContext} from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './css/introScene.module.css'
import {getIntroImages} from '../../services/characterServices'
import { useNotifications } from '../../hooks/useNotifications'
import { notificationsContext } from '../../contexts/NotificationsContext'
import { ErrorNotification } from '../Notifications/ErrorNotification/ErrorNotification'
import intro1 from '../../assets/intro1.jpg'
import intro2 from '../../assets/intro2.jpg'
import intro3 from '../../assets/intro3.jpg'
import intro4 from '../../assets/intro4.jpg'
import intro5 from '../../assets/intro5.jpg'
import introTexts from '../../assets/introTexts.json'

export function IntroScene({interval = 18000}){
const [images, setImages] = useState([intro1, intro2, intro3, intro4, intro5])
const [texts, setTexts] = useState([...introTexts])
const [imageIndex, setImageIndex] = useState(0)
const [isFading, setIsFading] = useState(false)
const [showFinalMessage, setShowFinalMessage] = useState(false)
const {error} = useContext(notificationsContext)
const {setNewError} = useNotifications

useEffect(() => {
    const fadeOutTime = 2000
        const timer = setTimeout(() => {
            setIsFading(true)
            const fadeOutTimer = setTimeout(() => {
                if(imageIndex === images.length - 1){
                    setShowFinalMessage(true)
                    setImageIndex(currIndex => currIndex + 1)
                }else if(imageIndex === images.length){
                    clearTimeout(timer);
                    clearTimeout(fadeOutTimer);    
                    return
                }else {
                    setImageIndex((prevIndex) => prevIndex + 1) 
                }
                setIsFading(false)
            }, fadeOutTime)
        }, interval)
    
        return () => clearTimeout(timer)
}, [imageIndex, interval])

return (
    <>
    {error && <ErrorNotification />}
    <section className={styles['intro-scene']}>
        {images.length > 0 && imageIndex <= images.length - 1
            ? images.map((image, index) => 
                <div 
                key={index} 
                className={isFading ? styles.carousel : index === imageIndex ? styles['carousel-active'] : styles.carousel} 
                style={{backgroundImage: `url(${image})`}}
                >
                    <div className={isFading ? styles['description-fade-out'] :  styles['description']}>
                       <p className={styles.text}>{texts[index]}</p>
                    </div>
                </div> 
            )
            : <h1>Waiting...</h1>
        }
        {
            showFinalMessage && <h1 className={styles['final-message']}>{texts[imageIndex]}</h1>
        }
    </section>
    </>
)
}