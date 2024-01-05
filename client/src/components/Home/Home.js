import styles from "./css/home.module.css"
import bgImg from "./images/home-bg.jpg"

export function Home(){

    return(
        <section className={styles['home-section']}>
            <div className={styles['bg-container']}>
                <img src={bgImg} className={styles.background}/>
            </div>
        </section>
    )
}