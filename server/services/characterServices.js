const charDbOperations = require("../dbOps/dbOpsCharacter.js");
const { client } = require("../config/db.js");

exports.getAvatars = async () => {
  try {
    let avatars = await charDbOperations.retrieveAvatars(client);
    return avatars;
  } catch (err) {
    console.log(err);
  }
};

exports.createCharacter = async (characterData) => {
  try {
    let charData = await charDbOperations.insertCharacter(
      characterData,
      client
    );
    return charData;
  } catch (err) {
    throw err;
  }
};

exports.getIntroImages = async () => {
  try {
    let introImages = await charDbOperations.retrieveIntroImages(client);
    return introImages;
  } catch (err) {
    throw err;
  }
};

exports.getCharacter = async (userId) => {
  try {
    let characterData = await charDbOperations.retrieveCharacterWithInventory(
      userId,
      client
    );
    return characterData;
  } catch (err) {
    throw err;
  }
};

exports.equipItem = async (characterId, itemId, slot) => {
  try {
    let updatedEquipment = await charDbOperations.insertIntoEquipment(
      characterId,
      itemId,
      slot,
      client
    );
    return updatedEquipment;
  } catch (err) {
    throw err;
  }
};

exports.unequipItem = async (characterId, slot, itemId) => {
  try {
    let updatedEquipment = await charDbOperations.removeFromEquipment(
      characterId,
      slot,
      itemId,
      client
    );
    return updatedEquipment;
  } catch (err) {
    throw err;
  }
};

exports.addToInventory = async (characterId, slot, itemId) => {
  try {
    if (slot === "torso") {
      slot = "armor";
    } else {
      slot =
        slot === "primary_weapon"
          ? "primary_weapon_id"
          : slot === "secondary_weapon"
          ? "secondary_weapon_id"
          : "armor_id";
    }
    await charDbOperations.insertIntoInventory(characterId, slot, itemId);
  } catch (err) {
    throw err;
  }
};
