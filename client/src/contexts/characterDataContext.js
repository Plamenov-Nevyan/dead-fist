import { createContext, useState } from "react";

const CharacterDataContext = createContext();

function CharacterDataProvider({ children }) {
  const [charData, setCharData] = useState({});

  const setData = (data, equipmentModifiers) => {
    setCharData(() => {
      const updatedData = {
        ...data,
        equipment_modifiers: {
          ...equipmentModifiers,
        },
      };
      return updatedData;
    });
  };

  const updateEquipment = (
    newEquipment,
    equipmentModifiers,
    equipOrUnequip,
    item
  ) => {
    if (equipOrUnequip === "return-to-slot") {
      setCharData((currData) => {
        return {
          ...currData,
          equipment: {
            ...currData.equipment,
          },
        };
      });
    }
    setCharData((currData) => {
      return {
        ...currData,
        equipment: { ...newEquipment },
        equipment_modifiers: { ...equipmentModifiers },
        inventory:
          equipOrUnequip === "equip"
            ? [
                ...currData.inventory.filter(
                  (itemInInv) => itemInInv.id !== item.id
                ),
              ]
            : [...currData.inventory, item],
      };
    });
  };

  const addToInventory = (item) =>
    setCharData((currData) => {
      return { ...currData, inventory: [...currData.inventory, item] };
    });

  const removeFromInventory = (criteriaVal) =>
    setCharData((currData) => {
      return {
        ...currData,
        inventory: [
          ...currData.inventory.filter(
            (item) => item[criteriaVal] !== criteriaVal
          ),
        ],
      };
    });

  return (
    <CharacterDataContext.Provider
      value={{
        charData,
        setData,
        updateEquipment,
        addToInventory,
        removeFromInventory,
      }}
    >
      {children}
    </CharacterDataContext.Provider>
  );
}

export { CharacterDataContext, CharacterDataProvider };
