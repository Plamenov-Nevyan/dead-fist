import styles from './css/avatar.module.css'

export function Avatar(){

    return (
        <div className={styles['avatar-content']}>
            <img src="https://drive.google.com/thumbnail?id=1612ilyU5SoVAedugYm2hC4n-qEOh018-" className={styles['player-avatar']} />
        </div>
    )
}