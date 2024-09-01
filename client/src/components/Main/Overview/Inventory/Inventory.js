import styles from './css/inventory.module.css'
import { useEffect, useRef, useState } from 'react';
import {DragOverlay, useDroppable, useDraggable, DndContext } from '@dnd-kit/core';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css'

export function Inventory(){
    const [equipment, setEquipment] = useState({
        helmet: null,
        armor: null,
        'primary-weapon': null,
        'secondary-weapon': null,
        boots: null,
    })
    const [activeId, setActiveId] = useState(null)
    const [activeItem, setActiveItem] = useState(null)
    const [sliderIndex, setSliderIndex] = useState(0)

    const [inventoryItems, setInventoryItems] = useState(
        [
            { id: 'weapon1', type: 'primary-weapon', src: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.pikpng.com%2Fpngl%2Fb%2F349-3496658_firearm-clipart.png&f=1&nofb=1&ipt=5affe4d1ff3d8ca92b37195811fddce5f832e738a7c1725e1f6fbbb873efd0bc&ipo=images" },
            { id: 'weapon2', type: 'primary-weapon', src: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ficon-library.com%2Fimages%2Fgun-icon-png%2Fgun-icon-png-15.jpg&f=1&nofb=1&ipt=faa06f1e9bf1fa40cce9fb3ca871b8ac9e2378568ac5529a23d1df62ec325994&ipo=images" },
        ]
    )
    const nextSlide = () => {
        setSliderIndex((prevIndex) => (prevIndex + 1) % inventoryItems.length);
    };

    const prevSlide = () => {
        setSliderIndex((prevIndex) => (prevIndex - 1 + inventoryItems.length) % inventoryItems.length);
    };

    const Draggable = ({id, type, src, children}) => {
        const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
            id,
            data: {type, src}
        })

        const style = {
            transform: `translate3d(${transform?.x}px, ${transform?.y}px, 0)`,
            zIndex: isDragging ? 1000 : 'auto',
            position: 'relative',
            cursor: 'grab',
            maxWidth: '100%',
            maxHeight: '100%',
            backgroundColor: 'rgba(222, 184, 135,.4)',
            borderRadius: '.7em',
            opacity: isDragging ? 0 : 1
        };

        return (
            <div ref={setNodeRef} style={style} {...listeners} {...attributes} className={styles.draggable}>
                {children}
            </div>
        );
    }

    const DraggableEquipped = ({ id, type, src, slotId, children }) => {
        const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
            id,
            data: { type, src, slotId } 
        });
    
        const style = {
            transform: isDragging ? `translate3d(${transform?.x}px, ${transform?.y}px, 0)` : 'none',
            zIndex: isDragging ? 1000 : 'auto',
            position: isDragging ? 'absolute' : 'relative',
            cursor: 'grab',
            opacity: isDragging ? 0 : 1, 
        };
    
        return (
            <div ref={setNodeRef} style={style} {...listeners} {...attributes} className={styles.draggable}>
                {children}
            </div>
        );
    };

    const Droppable = ({ id, acceptedType,className, children }) => {
        const { isOver, setNodeRef } = useDroppable({
            id,
        });
    
        const style = {
            backgroundColor: isOver && '#e0e0e0'
        };
    
        return (
            <div ref={setNodeRef} style={style} className={`${styles['droppable']} ${className}`}>
                {children}
            </div>
        );
    };

    const DroppableSlider = ({children }) => {
        const { isOver, setNodeRef } = useDroppable({
            id: 'slider',
        });

        return (
            <div ref={setNodeRef} id="slider" className={styles.slider}>
                {children}
            </div>
        );
    }

    const handleDragStart = (e) => {
        setActiveId(e.active.id)
        if(inventoryItems.some(item => item.id === e.active.id)){
            let draggedItem = inventoryItems.find(item => item.id === e.active.id)
            setActiveItem((currItem) => {return {...draggedItem}})
        }else{
            let draggedItem = Object.entries(equipment).find(([key, val]) => {
                if(val){
                    if(val.id === e.active.id){
                        return val
                    }
                }
            })
            setActiveItem((currItem) => {return {...draggedItem[1]}})
        }
    };
    
    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (over) {
            const activeType = active.data.current.type;
            const overId = over.id;
            const slotId = active.data.current.slotId;
            if (overId === activeType) {
                if(equipment[overId]){
                    setInventoryItems(prevItems => [...prevItems, equipment[overId]]);
                }
                setEquipment((prev) => {
                  return  {
                        ...prev,
                        [overId]: {id: active.id, type: active.data.current.type, src: active.data.current.src},
                    }
                });
                setInventoryItems(currItems => currItems.filter(item => item.id !== event.active.id))
            }else if (slotId) {
               if(overId === 'slider'){
                    setEquipment((prev) => ({
                        ...prev,
                        [slotId]: null,
                    }));
                    setInventoryItems(prevItems => [...prevItems, { id: active.id, type: active.data.current.type, src: active.data.current.src }]);
               }else {
                    setEquipment((prev) => ({
                        ...prev,
                        [slotId]: { id: active.id, type: active.data.current.type, src: active.data.current.src },
                    }));
               }
            }else {
                if (!inventoryItems.some(item => item.id === active.id)) {
                    setInventoryItems(prevItems => [...prevItems, activeItem]);
                }
            }
        }else{
            if (!inventoryItems.some(item => item.id === active.id)) {
                setInventoryItems(prevItems => [...prevItems, activeItem]);
            }
        }
        setActiveId(null)
        setActiveItem(null)
    };


    return(
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className={styles.inventory}>
                <div className={styles.equipped}>
                    <Droppable 
                        id="helmet" 
                        acceptedType="helmet" 
                        className={equipment['helmet'] ? styles['head-slot-equipped'] : styles['head-slot']}
                    >
                        {equipment.helmet && <DraggableEquipped
                             id={equipment.helmet.id}
                             type={equipment.helmet.type}
                             src={equipment.helmet.src}
                             slotId="helmet"
                            >
                                <img src={inventoryItems.find((item) => item.id === equipment.helmet).src}/>
                            </DraggableEquipped>
                    }
                    </Droppable>
                    <div className={styles['middle-slots']}>
                        <Droppable 
                            id="primary-weapon" 
                            acceptedType="primary-weapon" 
                            className={equipment['primary-weapon'] ? styles['prim-weapon-slot-equipped'] : styles['prim-weapon-slot']}
                        >
                            {equipment['primary-weapon'] && <DraggableEquipped 
                              id={equipment['primary-weapon'].id}
                              type={equipment['primary-weapon'].type}
                              src={equipment['primary-weapon'].src}
                              slotId="primary-weapon"
                            >
                                 <img src={equipment['primary-weapon'].src}/>
                            </DraggableEquipped>
                            }
                        </Droppable>
                        <Droppable 
                            id="armor" 
                            acceptedType="armor" 
                            className={equipment['armor'] ? styles['torso-slot-equipped'] : styles['torso-slot']}
                        >
                            {equipment.armor && <DraggableEquipped
                                id={equipment.armor.id}
                                type={equipment.armor.type}
                                src={equipment.armor.src}
                                slotId="armor"
                            >
                                <img src={inventoryItems.find((item) => item.id === equipment.armor).src}/>
                            </DraggableEquipped>
                            }
                        </Droppable>
                        <Droppable 
                            id="secondary-weapon" 
                            acceptedType="secondary-weapon" 
                            className={equipment['secondary-weapon'] ? styles['sec-weapon-slot-equipped'] : styles['sec-weapon-slot']}
                        >
                         {equipment['secondary-weapon'] &&  <DraggableEquipped
                                id={equipment.boots.id}
                                type={equipment.boots.type}
                                src={equipment.boots.src}
                                slotId="secondary-weapon"
                            >
                                <img src={inventoryItems.find((item) => item.id === equipment['secondary-weapon']).src}/>
                            </DraggableEquipped>
                            }
                        </Droppable>
                    </div>
                        <Droppable 
                        id="boots"
                        acceptedType="boots" 
                        className={equipment['boots'] ? styles['legs-slot-equipped'] : styles['legs-slot']}
                    >
                         {equipment.boots && <DraggableEquipped
                                id={equipment['secondary-weapon'].id}
                                type={equipment['secondary-weapon'].type}
                                src={equipment['secondary-weapon'].src}
                                slotId="secondary-weapon"
                            >
                                 <img src={inventoryItems.find((item) => item.id === equipment.boots).src}/>
                            </DraggableEquipped>
                            }
                    </Droppable>
                </div>
                <div className={styles['unequipped-and-stats']}>
                    <div className={styles.unequipped}>
                       {inventoryItems.length > 0 &&
                            <DroppableSlider>
                                {sliderIndex - 1 >= 0 &&  
                                    <div onClick={() => prevSlide()} className={styles['slider-button-prev']}>
                                        <svg className={styles['prev-icon']} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
                                    </div>
                                }
                                {inventoryItems.map((item, index) =>   
                                    <div key={index}  className={index === sliderIndex ? styles.slide : styles['slide-inactive']}>
                                        <Draggable id={item.id} type={item.type} src={item.src}>
                                            <img 
                                                src=  {item.src}
                                                className={styles['item-img']}
                                            /> 
                                        </Draggable>           
                                    </div>)
                                }        
                                {sliderIndex + 1 < inventoryItems.length && 
                                    <div onClick={() => nextSlide()} className={styles['slider-button-next']}>
                                        <svg className={styles['next-icon']} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"/></svg>
                                    </div>
                                }
                            </DroppableSlider>
                       }
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
            <DragOverlay>
                {activeItem ? (
                    <div
                        style={{
                            width: '243px',
                            height: '120px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <img
                            src={activeItem.src}
                            alt={activeItem.id}
                            style={{ width: '243px', height: '120px', objectFit: 'contain'}} // Adjust size as needed
                        />
                    </div>
                ) : null}
            </DragOverlay>
    </DndContext>
    )
}