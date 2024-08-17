import styles from './css/skillContainer.module.css'
import { useState } from 'react'

export function SkillContainer({skillName,remainingSkillPoints, changeSkillPoints, skillValues}){

    const onIncreaseSkill = (e) => {
        if(skillValues[skillName.toLowerCase()] > 1){
            changeSkillPoints('increaseRemPoints', skillName.toLowerCase())
        }
    }

    const onDecreaseSkill = (e) => {
        if(!remainingSkillPoints <= 0){
            changeSkillPoints('decreaseRemPoints', skillName.toLowerCase())
        }
    }

    return (
    <div className={styles['skill-container']}>
        <h3 className={styles['skill-name']}>{skillName}</h3>
        <div className={styles['value-manipulator']}>
            <svg onClick={(e) => onIncreaseSkill(e)} className={styles['value-btn'] + ' ' + skillName.toLowerCase()} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"/></svg>
        </div>
        <h3 className={styles['skill-value']}>{skillValues[skillName.toLowerCase()]}</h3>
        <div className={styles['value-manipulator']}>
            <svg onClick={(e) => onDecreaseSkill(e)} className={styles['value-btn'] + ' ' + skillName.toLowerCase()} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>
        </div>
    </div>
    )
}