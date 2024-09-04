import {useEffect, useState} from 'react'
// import globalMapImg from '../../../assets/map.png'
import styles from './css/globalMap.module.css'
import {MapTooltip} from '../../Tooltips/MapTooltip'
// import cityTooltipImg from '../../../assets/city-tooltip-bg.jpg'
// import quarantineZoneTooltipImg from '../../../assets/quarantine-zone-tooltip-bg.jpg'
// import townshipTooltipImg from '../../../assets/township-tooltip-bg.jpg'
// import riverTooltipImg from '../../../assets/river-tooltip-bg.png'
// import militaryBaseTooltipImg from '../../../assets/military-base-tooltip-bg.jpg'
// import mountainTooltipImg from '../../../assets/mountain-tooltip-bg.png'
// import woodTooltipImg from '../../../assets/wood-tooltip-bg.png'

export function GlobalMap({hoveredSubmenuOption}){
    const [showOverlay, setShowOverlay] = useState(hoveredSubmenuOption ? hoveredSubmenuOption : '')

    const onSetOverlayVisibility = (e) => {
        if(e){
            console.log(e.currentTarget)
            setShowOverlay(e.currentTarget.id) 
        }else {
            setShowOverlay('')
        }
    }

    useEffect(() => {
        if(hoveredSubmenuOption){
            setShowOverlay(hoveredSubmenuOption)
        }
    })

    return(
        <div className={styles['map-container']}>
            <img src="https://i.imgur.com/oUfIsNq.jpg" className={styles.map} />
            <div 
                onMouseOver={(e) => onSetOverlayVisibility(e)} 
                onMouseLeave={() => onSetOverlayVisibility()}
                id='city'
                className={showOverlay === 'city' ? styles['city-overlay'] : styles['city-overlay-inactive']}
             >
                {showOverlay === 'city' &&
                    <div className={styles['tooltip']}>
                        <MapTooltip 
                            thumbnail={"https://i.imgur.com/MX6ywYa.jpg"}  
                            text={'asadbasdahsbdjashdbjahsbdjhasbdjahsdbasjhdbjashbdjhasbd'}
                            locationName={'Alberra City'}
                            foundableItems={['Guns',  'Armor', 'Food', 'Ammo']}
                            locationDangerLevel={'Hard'}
                        />
                    </div>
                }
            </div>
            <div 
                onMouseOver={(e) => onSetOverlayVisibility(e)}
                onMouseLeave={() => onSetOverlayVisibility()}
                id='mountain' 
                className={showOverlay === 'mountain' ? styles['mountain-overlay'] : styles['mountain-overlay-inactive']}
             >
                {showOverlay === 'mountain' && 
                    <div className={styles['tooltip']}>
                        <MapTooltip 
                            thumbnail={"https://i.imgur.com/HIXMku5.png"}  
                            text={'asadbasdahsbdjashdbjahsbdjhasbdjahsdbasjhdbjashbdjhasbd'}
                            locationName={'Granton Mountains'}
                            foundableItems={['Guns',  'Armor', 'Food', 'Ammo']}
                            locationDangerLevel={'Easy'}
                        />
                    </div>
                }
            </div>
            <div 
                onMouseOver={(e) => onSetOverlayVisibility(e)} 
                onMouseLeave={() => onSetOverlayVisibility()}
                id='river'
                className={showOverlay === 'river' ? styles['river-overlay'] : styles['river-overlay-inactive']}
             >
                {showOverlay === 'river' && 
                         <div className={styles['tooltip']}>
                            <MapTooltip 
                                thumbnail={"https://i.imgur.com/SXBN26F.png"}  
                                text={'asadbasdahsbdjashdbjahsbdjhasbdjahsdbasjhdbjashbdjhasbd'}
                                locationName={'Sagell River'}
                                foundableItems={['Guns',  'Armor', 'Food', 'Ammo']}
                                locationDangerLevel={'Easy'}
                            />
                        </div>
                }
            </div>
            <div 
                onMouseOver={(e) => onSetOverlayVisibility(e)} 
                onMouseLeave={() => onSetOverlayVisibility()}
                id='quarantine-zone'
                className={showOverlay === 'quarantine-zone' ? styles['quarantine-zone-overlay'] : styles['quarantine-zone-overlay-inactive']}
             >
                {showOverlay === 'quarantine-zone' && 
                         <div className={styles['tooltip']}>
                            <MapTooltip 
                                thumbnail={"https://i.imgur.com/DagipHp.jpg"}  
                                text={'asadbasdahsbdjashdbjahsbdjhasbdjahsdbasjhdbjashbdjhasbd'}
                                locationName={'Ruined Quarantine Zone'}
                                foundableItems={['Guns',  'Armor', 'Food', 'Ammo']}
                                locationDangerLevel={'Hard'}
                            />
                        </div>
                }
            </div>
            <div 
                onMouseOver={(e) => onSetOverlayVisibility(e)} 
                onMouseLeave={() => onSetOverlayVisibility()}
                id='woods'
                className={showOverlay === 'woods' ? styles['woods-overlay'] : styles['woods-overlay-inactive']}
             >
                {showOverlay === 'woods' && 
                     <div className={styles['tooltip']}>
                        <MapTooltip 
                            thumbnail={"https://i.imgur.com/uMFPRLO.png"}  
                            text={'asadbasdahsbdjashdbjahsbdjhasbdjahsdbasjhdbjashbdjhasbd'}
                            locationName={'Ascadia Woods'}
                            foundableItems={['Guns',  'Armor', 'Food', 'Ammo']}
                            locationDangerLevel={'Normal'}
                        />
                    </div>
                }
            </div>
            <div 
                onMouseOver={(e) => onSetOverlayVisibility(e)} 
                onMouseLeave={() => onSetOverlayVisibility()}
                id='township'
                className={showOverlay === 'township' ? styles['township-overlay'] : styles['township-overlay-inactive']}
             >
                {showOverlay === 'township' && 
                   <div className={styles['tooltip']}>
                        <MapTooltip 
                            thumbnail={"https://i.imgur.com/HxyYSqa.jpg"}  
                            text={'asadbasdahsbdjashdbjahsbdjhasbdjahsdbasjhdbjashbdjhasbd'}
                            locationName={'St. Ivy Township'}
                            foundableItems={['Guns',  'Armor', 'Food', 'Ammo']}
                            locationDangerLevel={'Normal'}
                        />
                    </div>
                }
            </div>
            <div 
                onMouseOver={(e) => onSetOverlayVisibility(e)} 
                onMouseLeave={() => onSetOverlayVisibility()}
                id='military-base'
                className={showOverlay === 'military-base' ? styles['military-base-overlay'] : styles['military-base-overlay-inactive']}
             >
                {showOverlay === 'military-base' &&
                      <div className={styles['tooltip']}>
                        <MapTooltip 
                            thumbnail={"https://i.imgur.com/QzXXSLM.jpg"}  
                            text={'asadbasdahsbdjashdbjahsbdjhasbdjahsdbasjhdbjashbdjhasbd'}
                            locationName={'Reynolds Military Base'}
                            foundableItems={['Guns',  'Armor', 'Food', 'Ammo']}
                            locationDangerLevel={'Extreme'}
                        />
                     </div>
                }
            </div>
        </div>
    )
}