const baseURL = "http://localhost:8000/character";
const endpoints = {
  retrieve_avatars: "/get-avatars",
  create: "/create",
  retrieve_intro_images: "/get-intro-images",
  retrieve_character: "/retrieve",
  equip_item: "/equip",
  unequip_item: "/unequip",
  add_to_inventory: "/add-to-inventory",
};

export const getAvatars = async () => {
  let resp = await fetch(`${baseURL}${endpoints.retrieve_avatars}`);
  return resp.json();
};

export const createCharacter = async (characterData) => {
  let resp = await fetch(`${baseURL}${endpoints.create}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(characterData),
    credentials: "include",
  });
  return resp;
};

export const getIntroImages = async () => {
  let resp = await fetch(`${baseURL}${endpoints.retrieve_intro_images}`, {
    method: "GET",
    credentials: "include",
  });
  return resp;
};

export const getCharacterData = async () => {
  let resp = await fetch(`${baseURL}${endpoints.retrieve_character}`, {
    method: "GET",
    credentials: "include",
  });
  return resp;
};

export const equipItem = async (characterId, slot, itemId) => {
  let resp = await fetch(`${baseURL}${endpoints.equip_item}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ characterId, slot, itemId }),
    credentials: "include",
  });
  return resp;
};

export const unequipItem = async (characterId, slot, itemId) => {
  let resp = await fetch(`${baseURL}${endpoints.unequip_item}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ characterId, slot, itemId }),
    credentials: "include",
  });
  return resp;
};

export const addItemToInventory = async (characterId, slot, itemId) => {
  let resp = await fetch(`${baseURL}${endpoints.add_to_inventory}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ characterId, slot, itemId }),
    credentials: "include",
  });
  return resp;
};
