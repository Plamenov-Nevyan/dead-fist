import styles from './css/inventory.module.css'
import { useEffect, useRef, useState } from 'react';
import { useDroppable, useDraggable, DndContext } from '@dnd-kit/core';

export function Inventory(){
    const [equipment, setEquipment] = useState({
        helmet: null,
        armor: null,
        'primary-weapon': null,
        'secondary-weapon': null,
        boots: null,
    })
    const inventoryItems = [
        { id: 'weapon1', type: 'primary-weapon', src: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.pikpng.com%2Fpngl%2Fb%2F349-3496658_firearm-clipart.png&f=1&nofb=1&ipt=5affe4d1ff3d8ca92b37195811fddce5f832e738a7c1725e1f6fbbb873efd0bc&ipo=images" },
        { id: 'weapon2', type: 'primary-weapon', src: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ficon-library.com%2Fimages%2Fgun-icon-png%2Fgun-icon-png-15.jpg&f=1&nofb=1&ipt=faa06f1e9bf1fa40cce9fb3ca871b8ac9e2378568ac5529a23d1df62ec325994&ipo=images" },
    ];
    const swiperRef = useRef(0);

    // useEffect(() => {
    //     const swiperContainer = swiperRef.current;
    //     const params = {
    //       navigation: true,
    //       pagination: false,
    //       injectStyles: [
    //           `
    //             .swiper-button-next,
    //             .swiper-button-prev {
    //               color: white;
    //             }
      
    //             .swiper-pagination-bullet{
    //               width: 1rem;
    //               height: 1rem;
    //               background-color: white;
    //             }
    //         `,
    //         ],
    //     };
    //     Object.assign(swiperContainer, params);
    //     swiperContainer.initialize();
    //   }, []);

    const Draggable = ({id, type, children}) => {
        const {attributes, listeners, setNodeRef, transform} = useDraggable({
            id,
            data: {type}
        })

        const style = {
            transform: `translate3d(${transform?.x}px, ${transform?.y}px, 0)`,
        };

        return (
            <div ref={setNodeRef} style={style} {...listeners} {...attributes} className={styles.draggable}>
                {children}
            </div>
        );
    }

    const Droppable = ({ id, acceptedType,className, children }) => {
        const { isOver, setNodeRef } = useDroppable({
            id,
        });
    
        const style = {
            backgroundColor: isOver ? '#e0e0e0' : '#f9f9f9',
        };
    
        return (
            <div ref={setNodeRef} style={style} className={`${styles['droppable']} ${className}`}>
                {children}
            </div>
        );
    };

    const handleDragStart = () => {
        console.log(`ee`)
        if (swiperRef.current) {
            swiperRef.current.classList.add('swiper-disabled');
        }
    };
    
    const handleDragEnd = (event) => {
        if (swiperRef.current) {
            swiperRef.current.classList.remove('swiper-disabled');
        }

        const { active, over } = event;

        if (over) {
            const activeType = active.data.current.type;
            const overId = over.id;
            if (overId === activeType) {
                setEquipment((prev) => ({
                    ...prev,
                    [overId]: active.id,
                }));
            }
        }
    };


    return(
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className={styles.inventory}>
                <div className={styles.equipped}>
                    <Droppable id="helmet" acceptedType="helmet" className={styles['head-slot']}>
                        {equipment.helmet &&  <img src={inventoryItems.find((item) => item.id === equipment.helmet).src}/>}
                    </Droppable>
                    <div className={styles['middle-slots']}>
                        <Droppable id="primary-weapon" acceptedType="primary-weapon" className={styles['prim-weapon-slot']}>
                            {equipment['primary-weapon'] &&  <img src={inventoryItems.find((item) => item.id === equipment['primary-weapon']).src}/>}
                        </Droppable>
                        <Droppable id="armor" acceptedType="armor" className={styles['torso-slot']}>
                            {equipment.armor &&  <img src={inventoryItems.find((item) => item.id === equipment.armor).src}/>}
                        </Droppable>
                        <Droppable id="secondary-weapon" acceptedType="secondary-weapon" className={styles['sec-weapon-slot']}>
                         {equipment['secondary-weapon'] &&  <img src={inventoryItems.find((item) => item.id === equipment['secondary-weapon']).src}/>}
                        </Droppable>
                    </div>
                    <Droppable id="boots" acceptedType="boots" className={styles['legs-slot']}>
                         {equipment.boots &&  <img src={inventoryItems.find((item) => item.id === equipment.boots).src}/>}
                    </Droppable>
                </div>
                <div className={styles['unequipped-and-stats']}>
                    <div className={styles.unequipped}>
                        {/* <swiper-container className={styles['swiper']} ref={swiperRef} init="false" style={
                            {
                                height: '100%'
                            }
                        }
                        > */}
                          {inventoryItems.map((item) =>   
                        //   <swiper-slide lazy="true" className={styles.slide} style={
                        //     {
                        //         display: 'flex',
                        //         justifyContent: 'center',
                        //         alignItems: 'center',
                        //         height: '100%'
                        //     }
                        //     }>
                                <Draggable id={item.id} type={item.type}>
                                    <img 
                                        loading='lazy' 
                                        src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.pikpng.com%2Fpngl%2Fb%2F349-3496658_firearm-clipart.png&f=1&nofb=1&ipt=5affe4d1ff3d8ca92b37195811fddce5f832e738a7c1725e1f6fbbb873efd0bc&ipo=images" 
                                        className={styles['item-img']}
                                    /> 
                                </Draggable>           
                        //     </swiper-slide>)
                        //     }
                        // </swiper-container>
                          )}
                    </div>
                    <div className={styles.stats}>
                        <p className={styles['skill-points']}>Skill points: 1</p>
                        <div className={styles['skill-container']}>
                            <span className={styles['skill-name']}>
                                Strength: 3 
                                <svg className={styles['increase-skill-btn']} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"></path></svg>
                            </span>
                        </div>
                        <div className={styles['skill-container']}>
                            <span className={styles['skill-name']}>
                                Agility: 3 
                                <svg className={styles['increase-skill-btn']} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"></path></svg>
                            </span>
                        </div>
                        <div className={styles['skill-container']}>
                            <span className={styles['skill-name']}>
                                Shooting: 3 
                                <svg className={styles['increase-skill-btn']} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"></path></svg>
                            </span>
                        </div>
                        <div className={styles['skill-container']}>
                            <span className={styles['skill-name']}>
                                Intelligence: 3 
                                <svg className={styles['increase-skill-btn']} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"></path></svg>
                            </span>
                        </div>
                        <div className={styles['skill-container']}>
                            <span className={styles['skill-name']}>
                                Constitution: 3 
                                <svg className={styles['increase-skill-btn']} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"></path></svg>
                            </span>
                        </div>
                        <div className={styles['skill-container']}>
                            <span className={styles['skill-name']}>
                                Charisma: 3 
                                <svg className={styles['increase-skill-btn']} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"></path></svg>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
    </DndContext>
    )
}