import styles from './css/characterCreator.module.css'
import { getAvatars } from '../../services/characterServices'
import {useState} from 'react'
import {useEffect} from 'react'
import {AvatarsSlider} from './AvatarsSlider'
import {SkillsSelector} from './SkillsSelector'
import {getSessionInfo} from '../../services/authServices'

export function CharacterCreator(){
    const [avatars, setAvatars] = useState([])
    const [selectedGender, setSelectedGender] = useState('male')
    const [selectedAvatar, setSelectedAvatar] = useState(0)
    const [characterStats, setCharacterStats] = useState({
        name: '',
        gender: 'male',
        class: 'police-officer',
        skills: {
            strength: 1,
            shooting: 1,
            agility: 1,
            intelligence: 1,
            charisma: 1
        },
        bio: ''
    })
    const [skillValues, setSkillValues] = useState(({
        strength : characterStats.class == 'construction-worker' ? 3 : 1,
        shooting: characterStats.class == 'police-officer' ? 3 : 1,
        agility: characterStats.class == 'barman' ? 3 : 1,
        intelligence: characterStats.class == 'teacher' ? 3 : 1,
        charisma: characterStats.class == 'salesman' ? 3 : 1
    }))
    const [remainingSkillPoints, setRemainingSkillPoints] = useState(5)
    
    const onCharacterStatsChange = (e) => {
        setCharacterStats(currStats => {
            return {...currStats, [e.target.name] : e.target.value}
        })
        if(e.target.name === 'class'){
            setSkillValues((currValue) => {
                return {
                    strength : e.target.value === 'construction-worker' ? 3 : 1,
                    shooting: e.target.value === 'police-officer' ? 3 : 1,
                    agility: e.target.value === 'barman' ? 3 : 1,
                    intelligence: e.target.value === 'teacher' ? 3 : 1,
                    charisma: e.target.value === 'salesman' ? 3 : 1
                }
            })
        }else if(e.target.name === 'gender'){
            onGenderChange(e.target.value)
        }
    }

    useEffect(() => {
        getAvatars()
        .then(avatars => {
            setAvatars(currVal => [...avatars, ...currVal])
        })
        .catch(err => console.log(err))
    }, [])

    const onGenderChange = (gender) => {
        setSelectedGender(gender)
    }

    const onSelectAvatar = (e) => {
        setSelectedAvatar(currSelected => Number(e.target.id))
      }

    const onConfirmCreation = async () => {
        let userSession = await getSessionInfo()
        console.log(userSession)
        // const characterData = {
        //     ...characterStats,
        //     skills : {
        //         ...skillValues
        //     },
        //     avatar_id : selectedAvatar,
        //     user_id: userSession.id
        // }
        // console.log(characterData)
    }
    return (
        <section className={styles['char-creator-section']}>
            <h2 className={styles['creator-heading']}>It's time to create your survivor!</h2>
            <div className={styles['slider-container']}>
                <h3 className={styles['choose-avatar-heading']}>Choose your avatar</h3>
                <AvatarsSlider 
                avatars={
                    selectedGender === 'male' 
                    ? avatars.filter(avatar => avatar.gender === 'M') 
                    : avatars.filter(avatar => avatar.gender === 'F')
                }
                selectedAvatar={selectedAvatar}
                onSelectAvatar={onSelectAvatar}
                />
            </div>
            <div className={styles['skills-selector-container']}>
                <SkillsSelector 
                // onGenderChange={onGenderChange}
                remainingSkillPoints = {remainingSkillPoints}
                setRemainingSkillPoints={setRemainingSkillPoints}
                characterStats = {characterStats}
                setCharacterStats={setCharacterStats}
                skillValues={skillValues}
                setSkillValues={setSkillValues}
                onCharacterStatsChange={onCharacterStatsChange}
                onConfirmCreation={onConfirmCreation}
                />
            </div>
        </section>
    )
}