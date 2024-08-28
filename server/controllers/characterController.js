const express = require('express')
const {getAvatars, createCharacter}=require('../services/characterServices')
const {confirmCharCreated} = require('../services/authServices')
const router = express.Router()

router.get('/get-avatars', (req, res) => {
    getAvatars()
    .then((avatars) => {
        res.json(avatars)
    })
    .catch(err => console.log(err))
})

router.post('/create', (req, res) => {
    createCharacter(req.body)
    .then(async (charId) => {
       try{
         await confirmCharCreated(req.session.userData.userID)
         res.json(charId)
       }catch(err){
        throw err
       }
    })
    .catch(err => {
        res.status(500).json({message: 'Character creation failed, please try again or contact an admin!'})
    })
})


module.exports = router