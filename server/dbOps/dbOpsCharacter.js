async function retrieveAvatars(client) {
  try {
    const query = {
      text: "SELECT * FROM avatars",
    };
    const result = await client.query(query);
    if (result.rows.length >= 1) {
      return result.rows;
    } else {
      throw `Error while retrieving avatars...`;
    }
  } catch (err) {
    throw err;
  }
}

async function insertCharacter(characterData, client) {
  try {
    const query = {
      text: "INSERT INTO characters(user_id, avatar_id, gender, class, skills, bio) VALUES($1, $2, $3, $4, $5, $6) RETURNING id",
      values: [
        characterData.user_id,
        characterData.avatar_id,
        characterData.gender,
        characterData.class,
        characterData.skills,
        characterData.bio,
      ],
    };

    const result = await client.query(query);
    let charID = result.rows[0].id;
    let charData = await setUpCharacterInventory(charID, client);
    return charData;
  } catch (err) {
    throw err;
  }
}

async function retrieveIntroImages(client) {
  try {
    const query = {
      text: "SELECT * FROM intro_images",
    };
    const result = await client.query(query);
    if (result.rows.length >= 1) {
      return result.rows;
    } else {
      throw { message: `Error while retrieving intro images...` };
    }
  } catch (err) {
    throw err;
  }
}

const setUpCharacterInventory = async (charID, client) => {
  let inventoryWeaponQuery = {
    text: "INSERT INTO inventory (character_id, secondary_weapon_id, quantity) VALUES ($1, $2, $3)",
    values: [charID, 1, 1],
  };
  let inventoryArmorQuery = {
    text: "INSERT INTO inventory (character_id, armor_id) VALUES ($1, $2), ($1, $3)",
    values: [charID, 1, 5],
  };
  await Promise.all([
    client.query(inventoryWeaponQuery),
    client.query(inventoryArmorQuery),
  ]);
  let getCharacterWithInventoryQuery = {
    text: `
            SELECT 
                c.*,
                json_build_object(
                    'id', avt.id,
                    'link', avt.link,
                    'gender', avt.gender
                ) AS avatar, -- Building avatar object
                jsonb_agg(
                    CASE 
                        -- For primary weapon
                        WHEN pw.id IS NOT NULL THEN jsonb_build_object(
                            'type', pw.type,
                            'id', pw.id,
                            'name', pw.name,
                            'description', pw.description,
                            'damage_max', pw.damage_max,
                            'damage_min', pw.damage_min,
                            'critical_damage_max', pw.critical_damage_max,
                            'critical_damage_min', pw.critical_damage_min,
                            'critical_chance', pw.critical_chance,
                            'image', pw.image,
                            'category', pw.weapon_category
                        )
                        -- For secondary weapon
                        WHEN sw.id IS NOT NULL THEN jsonb_build_object(
                            'type', sw.type,
                            'id', sw.id,
                            'name', sw.name,
                            'description', sw.description,
                            'damage_max', sw.damage_max,
                            'damage_min', sw.damage_min,
                            'critical_damage_max', sw.critical_damage_max,
                            'critical_damage_min', sw.critical_damage_min,
                            'critical_chance', sw.critical_chance,
                            'image', sw.image,
                            'category', sw.weapon_category
                        )
                        -- For armor
                        WHEN a.id IS NOT NULL THEN jsonb_build_object(
                            'type', a.type,
                            'id', a.id,
                            'name', a.name,
                            'description', a.description,
                            'armor_modifier', a.armor_modifier,
                            'image', a.image,
                            'category', a.armor_category
                        )
                    END
        ) AS inventory
    FROM 
        characters c
    JOIN 
        inventory i ON c.id = i.character_id
    -- Join for primary weapon
    LEFT JOIN
        avatars avt ON c.avatar_id = avt.id
    -- Join for avatar
    LEFT JOIN 
        primary_weapons pw ON i.primary_weapon_id = pw.id
    -- Join for secondary weapon
    LEFT JOIN 
        secondary_weapons sw ON i.secondary_weapon_id = sw.id
    -- Join for armor
    LEFT JOIN 
        armor a ON i.armor_id = a.id
    WHERE 
        c.id = $1
    GROUP BY 
        c.id, avt.id, avt.link, avt.gender;
        `,
    values: [charID],
  };
  try {
    const result = await client.query(getCharacterWithInventoryQuery);
    let characterData = result.rows[0];
    return characterData;
  } catch (err) {
    throw err;
  }
};

async function retrieveCharacterWithInventory(userId, client) {
  let getCharacterWithInventoryQuery = {
    text: `
        SELECT 
            c.*,
            json_build_object(
                'id', avt.id,
                'link', avt.link,
                'gender', avt.gender
            ) AS avatar, -- Building avatar object
              COALESCE(
                jsonb_agg(
                    CASE 
                        -- For primary weapon
                        WHEN pw.id IS NOT NULL THEN jsonb_build_object(
                            'type', pw.type,
                            'id', pw.id,
                            'name', pw.name,
                            'description', pw.description,
                            'damage_max', pw.damage_max,
                            'damage_min', pw.damage_min,
                            'critical_damage_max', pw.critical_damage_max,
                            'critical_damage_min', pw.critical_damage_min,
                            'critical_chance', pw.critical_chance,
                            'image', pw.image,
                            'weapon_category', pw.weapon_category
                        )
                        -- For secondary weapon
                        WHEN sw.id IS NOT NULL THEN jsonb_build_object(
                            'type', sw.type,
                            'id', sw.id,
                            'name', sw.name,
                            'description', sw.description,
                            'damage_max', sw.damage_max,
                            'damage_min', sw.damage_min,
                            'critical_damage_max', sw.critical_damage_max,
                            'critical_damage_min', sw.critical_damage_min,
                            'critical_chance', sw.critical_chance,
                            'image', sw.image,
                            'weapon_category', sw.weapon_category
                        )
                        -- For armor
                        WHEN a.id IS NOT NULL THEN jsonb_build_object(
                            'type', a.type,
                            'id', a.id,
                            'name', a.name,
                            'description', a.description,
                            'armor_modifier', a.armor_modifier,
                            'image', a.image,
                            'armor_category', a.armor_category
                        )
                END
              ) FILTER (WHERE pw.id IS NOT NULL OR sw.id IS NOT NULL OR a.id IS NOT NULL),
              '[]'
    ) AS inventory
    FROM 
        characters c
    LEFT JOIN 
        inventory i ON c.id = i.character_id
    -- Join for primary weapon
    LEFT JOIN
        avatars avt ON c.avatar_id = avt.id
    -- Join for avatar
    LEFT JOIN 
        primary_weapons pw ON i.primary_weapon_id = pw.id
    -- Join for secondary weapon
    LEFT JOIN 
        secondary_weapons sw ON i.secondary_weapon_id = sw.id
    -- Join for armor
    LEFT JOIN 
        armor a ON i.armor_id = a.id
    WHERE 
        c.user_id = $1
    GROUP BY 
        c.id, avt.id, avt.link, avt.gender;
        `,
    values: [userId],
  };
  try {
    const result = await client.query(getCharacterWithInventoryQuery);
    if (result.rows.length > 0) {
      const equipmentRetrieved = await retrieveCharEquipment(
        result.rows[0].id,
        client
      );
      let characterData = {
        ...result.rows[0],
        equipment: { ...equipmentRetrieved },
      };
      return characterData;
    }
  } catch (err) {
    throw err;
  }
}

async function insertIntoEquipment(characterId, itemId, slot, client) {
  if (slot === "torso") {
    slot = "armor";
  }
  try {
    const queryRetrieve = {
      text: `SELECT equipment->>$1 AS currently_equipped FROM characters WHERE id = $2`,
      values: [slot, characterId],
    };
    const queryUpdate = {
      text: "UPDATE characters SET equipment = jsonb_set(equipment, $1::text[] , to_jsonb($2::int)) WHERE id = $3;",
      values: [`{${slot}}`, itemId, characterId],
    };
    const resultRetrieve = await client.query(queryRetrieve);
    const currentItem = resultRetrieve.rows[0].currently_equipped;
    console.log(currentItem)
    await client.query(queryUpdate);
    let inventorySlot =
      slot === "primary_weapon"
        ? "primary_weapon_id"
        : slot === "secondary_weapon"
        ? "secondary_weapon_id"
        : "armor_id";
    let [updatedEquipment, _] = await Promise.all([
      await retrieveCharEquipment(characterId, client),
      await removeFromInventory(characterId, inventorySlot, itemId, client),
    ]);
    if (currentItem) {
      await insertIntoInventory(
        characterId,
        inventorySlot,
        currentItem,
        client
      );
    }
    return updatedEquipment;
  } catch (err) {
    throw err;
  }
}

async function removeFromEquipment(characterId, slot, itemId, client) {
  if (slot === "torso") {
    slot = "armor";
  }
  try {
    const queryUpdate = {
      text: "UPDATE characters SET equipment = jsonb_set(equipment, $1 , 'null'::jsonb) WHERE id = $2;",
      values: [`{${slot}}`, characterId],
    };
    await client.query(queryUpdate);
    let inventorySlot =
      slot === "primary_weapon"
        ? "primary_weapon_id"
        : slot === "secondary_weapon"
        ? "secondary_weapon_id"
        : "armor_id";
    let [equipment, _] = await Promise.all([
      retrieveCharEquipment(characterId, client),
      insertIntoInventory(characterId, inventorySlot, itemId, client),
    ]);
    return equipment;
  } catch (err) {
    throw err;
  }
}

async function insertIntoInventory(characterId, inventorySlot, itemId, client) {
  try {
    const validSlotColumns = [
      "armor_id",
      "primary_weapon_id",
      "secondary_weapon_id",
    ];
    if (!validSlotColumns.includes(inventorySlot)) {
      throw {
        message: "You are trying to add invalid item in your inventory!",
      };
    }
    const query = {
      text: `
        INSERT INTO inventory (character_id, ${inventorySlot})
        VALUES ($1, $2)
        ON CONFLICT (id) DO UPDATE
        SET ${inventorySlot} = $2
        RETURNING ${inventorySlot} AS item_id;
      `,
      values: [characterId, itemId],
    };
    const result = await client.query(query);
    // if(result.rows.length > 0){
    //   let itemId = result.rows[0].item_id
    //   let itemTable = inventorySlot === 'armor_id' ? inventorySlot.replace('_id', '') : inventorySlot.replace('_id', '') + "s"
    //   const itemQuery = {
    //       text : `
    //           SELECT *
    //           FROM ${itemTable}
    //           WHERE id = $1
    //         ` ,
    //       values : [itemId]
    //   }
    //   let itemResult = await client.query(itemQuery)
    //   if (itemResult.rows.length > 0) {
    //     return itemResult.rows[0];
    //   } else {
    //     throw ({message: 'Failed to return your item back in inventory. Please try again or contact an admin.'});
    //   }
    // }
  } catch (err) {
    throw err;
  }
}
async function removeFromInventory(characterId, slot, itemId, client) {
  const validSlotColumns = [
    "armor_id",
    "primary_weapon_id",
    "secondary_weapon_id",
  ];
  if (!validSlotColumns.includes(slot)) {
    throw {
      message: "You are trying to remove invalid item in your inventory!",
    };
  }
  try {
    const query = {
      text:
        slot === "armor_id"
          ? `DELETE FROM inventory
        WHERE character_id = $1
        AND armor_id = $2
        RETURNING *;`
          : slot === "primary_weapon_id"
          ? `DELETE FROM inventory
              WHERE character_id = $1
              AND primary_weapon_id = $2
              RETURNING *;`
          : `DELETE FROM inventory
              WHERE character_id = $1
              AND secondary_weapon_id = $2
              RETURNING *;`,
      values: [characterId, itemId],
    };
    const result = await client.query(query);
  } catch (err) {
    throw err;
  }
}

async function retrieveCharEquipment(charId, client) {
  const query = {
    text: `
    SELECT
    c.id AS character_id,
    
 -- Helmet: return null if there's no helmet equipped
      CASE
        WHEN (equipment->>'helmet')::int IS NOT NULL THEN 
          jsonb_build_object(
            'id', (equipment->>'helmet')::int,
            'attributes', helmet
          )
        ELSE NULL
      END AS helmet,

      -- Armor: return null if there's no torso armor equipped
      CASE
        WHEN (equipment->>'armor')::int IS NOT NULL THEN
          jsonb_build_object(
            'id', (equipment->>'armor')::int,
            'attributes', torso
          )
        ELSE NULL
      END AS armor,

      -- Boots: return null if there's no boots equipped
      CASE
        WHEN (equipment->>'boots')::int IS NOT NULL THEN
          jsonb_build_object(
            'id', (equipment->>'boots')::int,
            'attributes', boots
          )
        ELSE NULL
      END AS boots,

      -- Primary weapon: return null if there's no primary weapon equipped
      CASE
        WHEN (equipment->>'primary_weapon')::int IS NOT NULL THEN
          jsonb_build_object(
            'id', (equipment->>'primary_weapon')::int,
            'attributes', primary_weapons
          )
        ELSE NULL
      END AS primary_weapon,

      -- Secondary weapon: return null if there's no secondary weapon equipped
      CASE
        WHEN (equipment->>'secondary_weapon')::int IS NOT NULL THEN
          jsonb_build_object(
            'id', (equipment->>'secondary_weapon')::int,
            'attributes', secondary_weapons
          )
        ELSE NULL
      END AS secondary_weapon

    FROM characters c
    LEFT JOIN armor AS helmet ON (equipment->>'helmet')::int = helmet.id AND helmet.armor_category = 'helmet'
    LEFT JOIN armor AS torso ON (equipment->>'armor')::int = torso.id AND torso.armor_category = 'torso'
    LEFT JOIN armor AS boots ON (equipment->>'boots')::int = boots.id AND boots.armor_category = 'boots'
    LEFT JOIN primary_weapons ON (equipment->>'primary_weapon')::int = primary_weapons.id
    LEFT JOIN secondary_weapons ON (equipment->>'secondary_weapon')::int = secondary_weapons.id
    WHERE c.id = $1;`,
    values: [charId],
  };
  try {
    const result = await client.query(query);
    if (result.rows.length > 0) {
      const equipment = {
        helmet: result.rows[0].helmet
          ? Object.assign(
              { id: result.rows[0].helmet.id },
              result.rows[0].helmet.attributes
            )
          : null,
        armor: result.rows[0].armor
          ? Object.assign(
              { id: result.rows[0].armor.id },
              result.rows[0].armor.attributes
            )
          : null,
        boots: result.rows[0].boots
          ? Object.assign(
              { id: result.rows[0].boots.id },
              result.rows[0].boots.attributes
            )
          : null,
        primary_weapon: result.rows[0].primary_weapon
          ? Object.assign(
              { id: result.rows[0].primary_weapon.id },
              result.rows[0].primary_weapon.attributes
            )
          : null,
        secondary_weapon: result.rows[0].secondary_weapon
          ? Object.assign(
              { id: result.rows[0].secondary_weapon.id },
              result.rows[0].secondary_weapon.attributes
            )
          : null,
      };
      return equipment;
    } else {
      throw {
        message:
          "Failed to retrieve equipment. Please try reloading the page or contact an admin!",
      };
    }
  } catch (err) {
    throw err;
  }
}

module.exports = {
  retrieveAvatars,
  insertCharacter,
  retrieveIntroImages,
  retrieveCharacterWithInventory,
  insertIntoEquipment,
  removeFromEquipment,
  insertIntoInventory,
};
