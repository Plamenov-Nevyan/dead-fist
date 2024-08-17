 import {useState} from 'react'
import styles from './css/skillsSelector.module.css'
 import {SkillContainer} from './SkillContainer'

export function SkillsSelector({
    remainingSkillPoints,
    setRemainingSkillPoints,
    characterStats,
    skillValues,
    setSkillValues,
    onCharacterStatsChange,
    onConfirmCreation
    }){

    
    const changeSkillPoints = (operation, skillName) => {
        if(operation === 'decreaseRemPoints'){
            setRemainingSkillPoints(currValue => currValue - 1)
            setSkillValues(currValues => {
                return {
                    ...currValues,
                    [skillName] : currValues[skillName] + 1
                }
            })

        }else if(operation === 'increaseRemPoints') {
            setRemainingSkillPoints(currValue => currValue + 1)
            setSkillValues(currValues => {
                return {
                    ...currValues,
                    [skillName] : currValues[skillName] - 1

                }
              })
        }
    }


    return (
        <>
        <h2 className={styles['assign-heading']}>Assign skills and character information</h2>
        <div className={styles['character-name']}>
            <label className={styles['name-label']} htmlFor='name'>Write your character's name</label>
            <input onChange={(e) => onCharacterStatsChange(e)} type='text' id='name' name='name' className={styles['name-input']} value={characterStats.name}/>
        </div>
        <div className={styles['character-gender']}>
            <h3 className={styles['gender-heading']}> Choose your character's gender</h3>
            <div className={styles['gender-options']}>
                <div className={styles['option']}>
                    <label className={styles['gender-label']} htmlFor='male'>Male</label>
                    <input onChange={(e) => onCharacterStatsChange(e)} type='radio' name='gender' value='male' checked={characterStats.gender === 'male'}/>
                </div>
               <div className={styles['option']}>
                     <label className={styles['gender-label']} htmlFor='female'>Female</label>
                    <input onChange={(e) => onCharacterStatsChange(e)} type='radio' name='gender' value='female' checked={characterStats.gender === 'female'}/>
               </div>
            </div>
        </div>
        <div className={styles['character-class']}>
            <label className={styles['class-label']} htmlFor='class'>Choose your character's occupation before the end times</label>
            <select onChange={(e) => onCharacterStatsChange(e)} id='class' name='class' className={styles['class-select']} value={characterStats.class}>
                <option value='police-officer'>Police Officer</option>
                <option value='construction-worker'>Construction Worker</option>
                <option value='barman'>Barman</option>
                <option value='teacher'>Teacher</option>
                <option value='salesman'>Salesman</option>
            </select>
        </div>
        <div className= {styles.skills}>
            <div className={styles['skills-description']}>
                <h3 className={styles['descr-heading']}>Choose your character's skills</h3>
                <h4 className={styles['remaining-heading']}>Remaining points: {remainingSkillPoints}</h4>
            </div>
            <SkillContainer 
                skillName={'Strength'} 
                remainingSkillPoints={remainingSkillPoints} 
                changeSkillPoints={changeSkillPoints} 
                skillValues={skillValues}
            />
            <SkillContainer 
                skillName={'Shooting'}
                remainingSkillPoints={remainingSkillPoints} 
                changeSkillPoints={changeSkillPoints} 
                skillValues={skillValues}
            />
            <SkillContainer 
                skillName={'Agility'}
                remainingSkillPoints={remainingSkillPoints} 
                changeSkillPoints={changeSkillPoints} 
                skillValues={skillValues}
            />
            <SkillContainer 
                skillName={'Intelligence'}
                remainingSkillPoints={remainingSkillPoints} 
                changeSkillPoints={changeSkillPoints} 
                skillValues={skillValues}
            />
            <SkillContainer 
                skillName={'Charisma'}
                remainingSkillPoints={remainingSkillPoints} 
                changeSkillPoints={changeSkillPoints} 
                skillValues={skillValues}
            />
        </div>
        <div className={styles['character-bio']}>
            <label className={styles['bio-label']} htmlFor='bio'>Write a short bio of your character (optional)</label>
            <textarea onChange={(e) => onCharacterStatsChange(e)} id='bio' name='bio' className={styles['bio-textarea']}></textarea>
        </div>
        <div className={styles['confirm-btn-container']}>
            <button onClick={(e) => onConfirmCreation(e)} className={styles['confirm-btn']}>Confirm</button>
        </div>
        </>
    )
}