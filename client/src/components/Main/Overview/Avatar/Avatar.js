import { useRef } from 'react'
import styles from './css/avatar.module.css'
import pagerTextBg from "../../../../assets/modifiers-text.png"

export function Avatar(){
    const scrollContainerRef = useRef(null);

    const scrollUp = () => {
        if(scrollContainerRef.current){
            scrollContainerRef.current.scrollBy({top: -50, behavior: 'smooth'})
        }
    }

    const scrollDown = () => {
        if(scrollContainerRef.current){
            scrollContainerRef.current.scrollBy({top: 50, behavior: 'smooth'})
        }
    }

    const scrollLeft = () => {
        if(scrollContainerRef.current){
            scrollContainerRef.current.scrollBy({left: -50, behavior: 'smooth'})
        }
    }

    const scrollRight = () => {
        if(scrollContainerRef.current){
            scrollContainerRef.current.scrollBy({left: 50, behavior: 'smooth'})
        }
    }

    return (
        <div className={styles['avatar-content']}>
            <div className={styles['avatar']}>
                <img src="https://drive.google.com/thumbnail?id=1612ilyU5SoVAedugYm2hC4n-qEOh018-" className={styles['player-avatar']} />
            </div>
            <div className={styles['modifiers']}>
                <div className={styles['modifiers-text']}>
                    <img src={pagerTextBg} className={styles['text-bg']} />
                    <div ref={scrollContainerRef} className={styles['scrollable-text']}>
                        <p>Pamparampanpamparammm</p>
                        <p>Pamparampanpamparammm</p>
                        <p>Pamparampanpamparammm</p>
                        <p>Pamparampanpamparammm</p>
                        <p>Pamparampanpamparammm</p>
                        <p>Pamparampanpamparammm</p>
                        <p>Pamparampanpamparammm</p>
                        <p>Pamparampanpamparammm</p>
                        <p>Pamparampanpamparammm</p>
                        <p>Pamparampanpamparammm</p>
                    </div>
                </div>
                <div className={styles['modifiers-btns']}>
                    <div className={styles['scroll-left']} onClick={scrollLeft}>
                        <div className={styles.overlay}>

                        </div>
                    </div>
                    <div className={styles['middle-scroll-btns']}>
                        <div onClick={scrollUp} className={styles['scroll-up']}>
                            <div className={styles.overlay}>

                            </div>
                        </div>
                        <div onClick={scrollDown} className={styles['scroll-down']}>
                            <div className={styles.overlay}>

                            </div>
                        </div>
                    </div>
                    <div className={styles['scroll-right']} onClick={scrollRight}>
                        <div className={styles.overlay}>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}