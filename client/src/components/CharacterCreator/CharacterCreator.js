import {useState, useEffect, useContext} from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './css/characterCreator.module.css'
import { createCharacter, getAvatars } from '../../services/characterServices'
import {notificationsContext} from '../../contexts/NotificationsContext'
import {ErrorNotification} from '../Notifications/ErrorNotification/ErrorNotification'
import { useNotifications } from '../../hooks/useNotifications'
import {AvatarsSlider} from './AvatarsSlider'
import {SkillsSelector} from './SkillsSelector'
import {getSessionInfo} from '../../services/authServices'
import {Modal} from '../Modal/Modal'

export function CharacterCreator(){
    const [avatars, setAvatars] = useState([])
    const [selectedGender, setSelectedGender] = useState('male')
    const [selectedAvatar, setSelectedAvatar] = useState(0)
    const [avatarError, setAvatarError] = useState(false)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [characterStats, setCharacterStats] = useState({
        gender: 'male',
        class: 'police-officer',
        skills: {
            strength: 1,
            shooting: 1,
            agility: 1,
            intelligence: 1,
            charisma: 1,
            constitution: 1
        },
        bio: ''
    })
    const [skillValues, setSkillValues] = useState(({
        strength : characterStats.class == 'construction-worker' ? 3 : 1,
        shooting: characterStats.class == 'police-officer' ? 3 : 1,
        agility: characterStats.class == 'barman' ? 3 : 1,
        intelligence: characterStats.class == 'teacher' ? 3 : 1,
        charisma: characterStats.class == 'salesman' ? 3 : 1,
        constitution: characterStats.class == 'fitness-instructor' ? 3 : 1
    }))
    const [remainingSkillPoints, setRemainingSkillPoints] = useState(5)
    const [pointsError, setPointsError] = useState(false)
    const clearPointsError = () => setPointsError(false)
    const { error } = useContext(notificationsContext);
    const { setNewError } = useNotifications();
    const navigate = useNavigate()
    
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
                    charisma: e.target.value === 'salesman' ? 3 : 1,
                    constitution: e.target.value === 'fitness-instructor' ? 3 : 1
                }
            })
            setRemainingSkillPoints(5)
        }else if(e.target.name === 'gender'){
            setSelectedAvatar(currVal => 0)
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
        if(avatarError){
            setAvatarError(false)
        }
        if(e.target.id !== 'checkmark_close'){
            if(selectedAvatar === Number(e.target.id)){
                setSelectedAvatar(currValue => 0)
            }else {
                setSelectedAvatar(currSelected => Number(e.target.id))
            }
        }  
      }

    const onConfirmCreation = async () => {
        if(selectedAvatar === 0){
            return setAvatarError(true)
        }else if(remainingSkillPoints > 0){
            return setPointsError(true)
        }
        setShowConfirmModal(true)
    }

    const createCharacterModalConfirm = async () => {
        try {
            let respSess = await getSessionInfo('userID')
            let dataSess = await respSess.json()
            const characterData = {
                ...characterStats,
                skills : {
                    ...skillValues
                },
                avatar_id : selectedAvatar,
                user_id: dataSess.userID
            }
            let respChar = await createCharacter(characterData)
            let dataChar = await respChar.json()
            if(!respChar.ok){
                throw dataChar.message
            }
            modalClose()
            navigate('/intro')
        }catch(err){
            return setNewError(err)
        }
    }

    const modalClose = () => setShowConfirmModal(false)

    return (
        <>
        {error && <ErrorNotification/>}
        {showConfirmModal && <Modal buttons = {
            [
                {
                    text: 'Yes',
                    func: createCharacterModalConfirm
                },
                {
                    text: 'Cancel',
                    func: modalClose
                }
            ]
        }
        text = {'Are you sure you want to create this character ? You wont be able to edit stats later.'}
        showCloseBtn={true}
        closeModal={modalClose}
        />
        }
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
                {avatarError && <h4 
                className={styles['error-h4']}
                >
                    Please choose your avatar before continuing! 
                    <span onClick={(e) => onSelectAvatar(e)} id='checkmark_close' className={styles['close-error']}>&#10003;</span>
                </h4>}
            </div>
            <div className={styles['skills-selector-container']}>
                <SkillsSelector 
                // onGenderChange={onGenderChange}
                pointsError={pointsError}
                clearPointsError={clearPointsError}
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
        </>
    )
}