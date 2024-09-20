import styles from "./css/inventory.module.css";
import {useState } from "react";
import {
  DragOverlay,
  useDroppable,
  useDraggable,
  DndContext,
} from "@dnd-kit/core";
import { LoadingSpinnerMain } from "../../../Spinners/LoadingSpinnerMain";
import { addItemToInventory, equipItem, unequipItem } from "../../../../services/characterServices";
import { useCharacterData } from "../../../../hooks/useCharacterData";

export function Inventory({setError}){
  const [activeId, setActiveId] = useState(null);
  const [activeItem, setActiveItem] = useState({});
  const [sliderIndex, setSliderIndex] = useState(0);
  const { charData, updateCharEquipment, addToCharInventory } = useCharacterData();

  const nextSlide = () => {
    setSliderIndex((prevIndex) => (prevIndex + 1) % charData.inventory.length);
  };

  const prevSlide = () => {
    setSliderIndex(
      (prevIndex) =>
        (prevIndex - 1 + charData.inventory.length) % charData.inventory.length
    );
  };

  const Draggable = ({ id, type, image, children }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } =
      useDraggable({
        id,
        data: { type, image },
      });

    const style = {
      transform: `translate3d(${transform?.x}px, ${transform?.y}px, 0)`,
      zIndex: isDragging ? 1000 : "auto",
      position: "relative",
      cursor: "grab",
      maxWidth: "100%",
      maxHeight: "100%",
      backgroundColor: "rgba(222, 184, 135,.4)",
      borderRadius: ".7em",
      opacity: isDragging ? 0 : 1,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className={styles.draggable}
      >
        {children}
      </div>
    );
  };

  const DraggableEquipped = ({ id, type, image, slotId, children }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } =
      useDraggable({
        id,
        data: { type, image, slotId },
      });

    const style = {
      transform: `translate3d(${transform?.x}px, ${transform?.y}px, 0)`,
      zIndex: isDragging ? 1000 : "auto",
      position: "relative",
      cursor: "grab",
      opacity: isDragging ? 0 : 1,
    };
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className={styles.draggable}
      >
        {children}
      </div>
    );
  };

  const Droppable = ({ id, acceptedType, className, children }) => {
    const { isOver, setNodeRef } = useDroppable({
      id,
    });
    const style = {
      backgroundColor: isOver && "#e0e0e0",
    };
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`${styles["droppable"]} ${className}`}
      >
        {children}
      </div>
    );
  };

  const DroppableSlider = ({ children }) => {
    const { isOver, setNodeRef } = useDroppable({
      id: "slider",
    });

    return (
      <div ref={setNodeRef} id="slider" className={styles.slider}>
        {children}
      </div>
    );
  };

  const handleDragStart = (e) => {
    console.log(charData.inventory);
    let currActiveId = e.active.id;
    setActiveId(currActiveId);
    // inventoryItems.some(item => item.id === currActiveId)
    if (charData.inventory.some((item) => item.id === currActiveId)) {
      // let draggedItem = inventoryItems.find(item => item.id === currActiveId)
      let draggedItem = charData.inventory.find(
        (item) => item.id === currActiveId
      );
      setActiveItem((currItem) => {
        return { ...draggedItem };
      });
    } else {
      let draggedItem = Object.entries(charData.equipment).find(
        ([key, val]) => {
          if (val) {
            if (val.id === currActiveId) {
              return val;
            }
          }
        }
      );
      setActiveItem((currItem) => {
        return { ...draggedItem[1] };
      });
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (over) {
      const activeType = active.data.current.type;
      const overId = over.id;
      const slotId = active.data.current.slotId;

      if (overId === activeType) {
        if (charData.equipment[overId]) {
          addToCharInventory(charData.equipment[overId]);
        }
        try {
          let equipResp = await equipItem(
            charData.id,
            activeItem.type === "armor"
              ? activeItem.armor_category
              : activeItem.type,
            activeItem.id.split("-")[0]
          );
          let updatedEquipment = await equipResp.json();
          if (!equipResp.ok) {
            throw updatedEquipment;
          }
          updateCharEquipment(updatedEquipment, "equip", activeItem);
        } catch (err) {
          setError(err.message);
        }
        setSliderIndex((currIndex) => {
          if (currIndex - 1 >= 0) {
            return currIndex - 1;
          } else if (currIndex + 1 < charData.inventory.length) {
            return currIndex + 1;
          }
          return currIndex;
        });
      } else if (slotId) {
        if (overId === "slider") {
          try {
            let equipmentResp = await unequipItem(
              charData.id,
              activeItem.type === "armor"
                ? activeItem.armor_category
                : activeItem.type,
              activeItem.id.split("-")[0]
            );
            let updatedEquipment = await equipmentResp.json();
            if (!equipmentResp.ok) {
              throw updatedEquipment;
            }
            updateCharEquipment(updatedEquipment, "unequip", activeItem);
            setSliderIndex(() => charData.inventory.length)
          } catch (err) {
            setError(err.message);
          }
        } else {
          updateCharEquipment("", "return-to-slot");
        }
      } else {
        if (!charData.inventory.some((item) => item.id === active.id)) {
          addToCharInventory(activeItem);
        }
      }
    } else {
      if (!charData.inventory.some((item) => item.id === active.id)) {
        addToCharInventory(activeItem);
      }
    }
    setActiveId(null);
    setActiveItem(null);
  };

  return (
    <>
      {Object.entries(charData).length > 0 && charData.inventory ? (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className={styles.inventory}>
            <div className={styles.equipped}>
              <Droppable
                id="helmet"
                acceptedType="helmet"
                className={
                  charData.equipment["helmet"]
                    ? styles["head-slot-equipped"]
                    : styles["head-slot"]
                }
              >
                {charData.equipment.helmet && (
                  <DraggableEquipped
                    id={charData.equipment.helmet.id}
                    type={charData.equipment.helmet.armor_category}
                    image={charData.equipment.helmet.image}
                    slotId="helmet"
                  >
                    <img src={charData.equipment["helmet"].image} />
                  </DraggableEquipped>
                )}
              </Droppable>
              <div className={styles["middle-slots"]}>
                <Droppable
                  id="primary_weapon"
                  acceptedType="primary_weapon"
                  className={
                    charData.equipment["primary_weapon"]
                      ? styles["prim-weapon-slot-equipped"]
                      : styles["prim-weapon-slot"]
                  }
                >
                  {charData.equipment["primary_weapon"] && (
                    <DraggableEquipped
                      id={charData.equipment["primary_weapon"].id}
                      type={charData.equipment["primary_weapon"].type}
                      image={charData.equipment["primary_weapon"].image}
                      slotId="primary_weapon"
                    >
                      <img src={charData.equipment["primary_weapon"].image} />
                    </DraggableEquipped>
                  )}
                </Droppable>
                <Droppable
                  id="armor"
                  acceptedType="armor"
                  className={
                    charData.equipment["armor"]
                      ? styles["torso-slot-equipped"]
                      : styles["torso-slot"]
                  }
                >
                  {charData.equipment.armor && (
                    <DraggableEquipped
                      id={charData.equipment.armor.id}
                      type={"armor"}
                      image={charData.equipment.armor.image}
                      slotId="armor"
                    >
                      <img src={charData.equipment["armor"].image} />
                    </DraggableEquipped>
                  )}
                </Droppable>
                <Droppable
                  id="secondary_weapon"
                  acceptedType="secondary_weapon"
                  className={
                    charData.equipment["secondary_weapon"]
                      ? styles["sec-weapon-slot-equipped"]
                      : styles["sec-weapon-slot"]
                  }
                >
                  {charData.equipment["secondary_weapon"] && (
                    <DraggableEquipped
                      id={charData.equipment.secondary_weapon.id}
                      type={charData.equipment.secondary_weapon.type}
                      image={charData.equipment.secondary_weapon.image}
                      slotId="secondary_weapon"
                    >
                      <img src={charData.equipment["secondary_weapon"].image} />
                    </DraggableEquipped>
                  )}
                </Droppable>
              </div>
              <Droppable
                id="boots"
                acceptedType="boots"
                className={
                  charData.equipment["boots"]
                    ? styles["legs-slot-equipped"]
                    : styles["legs-slot"]
                }
              >
                {charData.equipment.boots && (
                  <DraggableEquipped
                    id={charData.equipment.boots.id}
                    type={charData.equipment.boots.armor_category}
                    image={charData.equipment.boots.image}
                    slotId="boots"
                  >
                    <img src={charData.equipment["boots"].image} />
                  </DraggableEquipped>
                )}
              </Droppable>
            </div>
            <div className={styles["unequipped-and-stats"]}>
              <div className={styles.unequipped}>
                <DroppableSlider>
                  {charData.inventory.length > 0 ? (
                    <>
                      {sliderIndex - 1 >= 0 && (
                        <div
                          onClick={() => prevSlide()}
                          className={styles["slider-button-prev"]}
                        >
                          <svg
                            className={styles["prev-icon"]}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 320 512"
                          >
                            <path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
                          </svg>
                        </div>
                      )}
                      {charData.inventory.map((item, index) => (
                        <div
                          key={index}
                          className={
                            index === sliderIndex
                              ? styles.slide
                              : styles["slide-inactive"]
                          }
                        >
                          <Draggable
                            id={item.id}
                            type={
                              item.type === "armor"
                                ? item.armor_category === "torso"
                                  ? "armor"
                                  : item.armor_category
                                : item.type
                            }
                            image={item.image}
                          >
                            <img
                              src={item.image}
                              className={styles["item-img"]}
                            />
                          </Draggable>
                        </div>
                      ))}
                      {sliderIndex + 1 < charData.inventory.length && (
                        <div
                          onClick={() => nextSlide()}
                          className={styles["slider-button-next"]}
                        >
                          <svg
                            className={styles["next-icon"]}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 320 512"
                          >
                            <path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" />
                          </svg>
                        </div>
                      )}
                    </>
                  ) : null}
                </DroppableSlider>
              </div>
              <div className={styles.stats}>
                <p className={styles["skill-points"]}>Skill points: 1</p>
                <div className={styles["skill-container"]}>
                  <span className={styles["skill-name"]}>
                    Strength: 3
                    <svg
                      className={styles["increase-skill-btn"]}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                    >
                      <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"></path>
                    </svg>
                  </span>
                </div>
                <div className={styles["skill-container"]}>
                  <span className={styles["skill-name"]}>
                    Agility: 3
                    <svg
                      className={styles["increase-skill-btn"]}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                    >
                      <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"></path>
                    </svg>
                  </span>
                </div>
                <div className={styles["skill-container"]}>
                  <span className={styles["skill-name"]}>
                    Shooting: 3
                    <svg
                      className={styles["increase-skill-btn"]}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                    >
                      <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"></path>
                    </svg>
                  </span>
                </div>
                <div className={styles["skill-container"]}>
                  <span className={styles["skill-name"]}>
                    Intelligence: 3
                    <svg
                      className={styles["increase-skill-btn"]}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                    >
                      <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"></path>
                    </svg>
                  </span>
                </div>
                <div className={styles["skill-container"]}>
                  <span className={styles["skill-name"]}>
                    Constitution: 3
                    <svg
                      className={styles["increase-skill-btn"]}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                    >
                      <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"></path>
                    </svg>
                  </span>
                </div>
                <div className={styles["skill-container"]}>
                  <span className={styles["skill-name"]}>
                    Charisma: 3
                    <svg
                      className={styles["increase-skill-btn"]}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                    >
                      <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"></path>
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <DragOverlay>
            {activeItem && activeId ? (
              <div
                id={activeId}
                // style={{
                //     width: '243px',
                //     height: '120px',
                //     display: 'flex',
                //     justifyContent: 'center',
                //     alignItems: 'center',
                //     pointerEvents: 'none'
                // }}
              >
                <img
                  src={activeItem.image}
                  alt={
                    activeItem.type === "armor"
                      ? `${activeItem.armor_category} Armor`
                      : activeItem.weapon_category
                  }
                  style={{
                    width: "243px",
                    height: "120px",
                    objectFit: "contain",
                  }}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      ) : (
        <LoadingSpinnerMain positions={{ top: "50%", left: "50%" }} />
      )}
    </>
  );
}
