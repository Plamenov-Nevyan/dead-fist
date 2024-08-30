import {useState} from 'react'
import styles from './css/overview.module.css'
import {Avatar} from './Avatar/Avatar'
import {Inventory} from './Inventory/Inventory'

export function Overview(){
    const [selectedOption, setSelectedOption] = useState('inventory')

    return (
        <section className={styles['overview']}>
            {selectedOption === 'inventory' && <div className={styles['inventory-content']}>
                    <Avatar />
                    <Inventory />
                </div>
            }
        </section>
    )
}