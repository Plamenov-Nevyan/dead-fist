import styles from './css/avatar.module.css'
import pagerTextBg from "../../../../assets/modifiers-text.png"

export function Avatar(){

    return (
        <div className={styles['avatar-content']}>
            <div className={styles['avatar']}>
                <img src="https://drive.google.com/thumbnail?id=1612ilyU5SoVAedugYm2hC4n-qEOh018-" className={styles['player-avatar']} />
            </div>
            <div className={styles['modifiers']}>
                <div className={styles['modifiers-text']}>
                    <img src={pagerTextBg} className={styles['text-bg']} />
                </div>
                <div className={styles['modifiers-btns']}>
                    <div className={styles['scroll-left']}>

                    </div>
                    <div className={styles['middle-scroll-btns']}>
                        <div className={styles['scroll-up']}>

                        </div>
                        <div className={styles['scroll-down']}>

                        </div>
                    </div>
                    <div className={styles['scroll-right']}>

                    </div>
                </div>
            </div>
        </div>
    )
}