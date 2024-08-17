const express = require('express')
const {getAvatars}=require('../services/characterServices')
const router = express.Router()

router.get('/get-avatars', (req, res) => {
    getAvatars()
    .then((avatars) => {
        res.json(avatars)
    })
    .catch(err => console.log(err))
})


module.exports = router