import {useState} from 'react'
import styles from './css/main.module.css'
import {Overview} from './Overview/Overview'
import sidebarBg from '../../assets/sidebar-bg.png'

export function Main(){
    const [selectedOption, setSelectedOption] = useState('overview')

    const onSelectOption = (e) => setSelectedOption(currSelected => e.target.id)

    return (
        <main className={styles.main}>
            <section className={styles.content}>
                <div className={styles['sidebar-content']}>
                    <img src={sidebarBg} className={styles['sidebar-bg']} />
                    <ul className={styles['sidebar-options']}>
                        <li 
                        className={selectedOption === 'overview' ? styles['option-active'] : styles.option}
                        onClick={(e) => onSelectOption(e)}
                        id="overview"
                        >
                            Overview
                        </li>
                    </ul>
                </div>
                <div className={styles['option-content']}>
                    {selectedOption === 'overview' && <Overview />}
                </div>
            </section>
        </main>
    )
}