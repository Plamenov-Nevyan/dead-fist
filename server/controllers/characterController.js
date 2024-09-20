const express = require("express");
const {
  getAvatars,
  createCharacter,
  retrieveIntroImages,
  getIntroImages,
  getCharacter,
  equipItem,
  unequipItem,
  addToInventory,
} = require("../services/characterServices");
const { confirmCharCreated } = require("../services/authServices");
const router = express.Router();

router.get("/get-avatars", (req, res) => {
  getAvatars()
    .then((avatars) => {
      res.json(avatars);
    })
    .catch((err) => console.log(err));
});

router.post("/create", (req, res) => {
  createCharacter(req.body)
    .then(async (characterData) => {
      try {
        await confirmCharCreated(req.session.userData.userID);
        console.log(characterData);
        res.json(characterData);
      } catch (err) {
        throw err;
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err.message });
    });
});

router.get("/get-intro-images", (req, res) => {
  getIntroImages()
    .then((images) => {
      res.json(images);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

router.get("/retrieve", (req, res) => {
  getCharacter(req.session.userData.userID)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message:
          "Sorry, we didn't manage to retrieve you character. Please try again later or contact an admin.",
      });
    });
});

router.post("/equip", (req, res) => {
  equipItem(req.body.characterId, req.body.itemId, req.body.slot)
    .then((updatedEquipment) => {
      res.json(updatedEquipment);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err.message });
    });
});

router.post("/unequip", (req, res) => {
  unequipItem(req.body.characterId, req.body.slot, req.body.itemId)
    .then((updatedEquipment) => {
      res.json(updatedEquipment);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

router.post("/add-to-inventory", async (req, res) => {
  try {
    await addToInventory(req.body.characterId, req.body.slot, req.body.itemId);
  } catch (err) {
    res.json(500).message({ message: err.message });
  }
});

module.exports = router;
