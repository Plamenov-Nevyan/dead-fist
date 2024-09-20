import { useState, useContext } from "react";
import { CharacterDataContext } from "../contexts/characterDataContext";

export function useCharacterData() {
  const {
    charData,
    setData,
    updateEquipment,
    addToInventory,
    removeFromInventory,
  } = useContext(CharacterDataContext);

  const setCharData = (data) => {
    let equipmentModifiers = calcDamageAndArmorFromEquipment(
      data.equipment,
      "equip"
    );
    Object.entries(data).map(([key, val]) => {
      if (key === "inventory") {
        val.map((item) => (item.id = item.id + "-" + item.name));
      } else if (key === "equipment") {
        Object.values(val).map((item) =>
          item ? (item.id = item.id + "-" + item.name) : null
        );
      }
    });
    setData(data, equipmentModifiers);
  };

  const updateCharEquipment = (newEquipment, equipOrUnequip, item) => {
    let equipmentModifiers = calcDamageAndArmorFromEquipment(newEquipment);
    Object.values(newEquipment).map((item) =>
      item ? (item.id = item.id + "-" + item.name) : null
    );
    if (equipOrUnequip !== "return-to-slot") {
      updateEquipment(newEquipment, equipmentModifiers, equipOrUnequip, item);
    }
  };

  const addToCharInventory = (item) => addToInventory(item);
  const removeFromCharInventory = (criteriaVal) =>
    removeFromInventory(criteriaVal);

  return {
    charData,
    setCharData,
    updateCharEquipment,
    addToCharInventory,
    removeFromCharInventory,
  };
}

const calcDamageAndArmorFromEquipment = (equipment) => {
  let [
    // ------------ Primary weapon
    damagePrimaryMax,
    criticalDamagePrimMax,
    damagePrimaryMin,
    criticalDamagePrimMin,
    criticalChancePrimary,
    // ----------- Secondary weapon
    damageSecondaryMax,
    criticalDamageSecMax,
    damageSecondaryMin,
    criticalDamageSecMin,
    criticalChanceSecondary,
    // ----------- Armor
    armorModifier,
  ] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  if (Object.values(equipment).some((item) => item !== null)) {
    Object.entries(equipment).map(([key, val]) => {
      if (key === "primary_weapon" && val !== null) {
        damagePrimaryMax += val.damage_max;
        criticalDamagePrimMax += val.critical_damage_max;
        damagePrimaryMin += val.damage_min;
        criticalDamagePrimMin += val.critical_damage_min;
        criticalChancePrimary += val.critical_chance;
      } else if (key === "secondary_weapon" && val !== null) {
        damageSecondaryMax += val.damage_max;
        criticalDamageSecMax += val.critical_damage_max;
        damageSecondaryMin += val.damage_min;
        criticalDamageSecMin += val.critical_damage_min;
        criticalChanceSecondary += val.critical_chance;
      } else if (
        (key === "armor" && val !== null) ||
        (key === "helmet" && val !== null) ||
        (key === "boots" && val !== null)
      ) {
        armorModifier += val.armor_modifier;
      }
    });
  }
  return {
    primary_weapon_modifiers: {
      damagePrimaryMax,
      criticalDamagePrimMax,
      damagePrimaryMin,
      criticalDamagePrimMin,
      criticalChancePrimary,
    },
    secondary_weapon_modifiers: {
      damageSecondaryMax,
      criticalDamageSecMax,
      damageSecondaryMin,
      criticalDamageSecMin,
      criticalChanceSecondary,
    },
    armor_modifier: armorModifier !== 0 ? armorModifier : null,
  };
};
