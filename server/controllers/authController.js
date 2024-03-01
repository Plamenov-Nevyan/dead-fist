const express = require('express')
const {registerUser, loginUser} = require("../services/authServices.js")
const router = express.Router()

router.post('/register', (req, res) => {
    registerUser(req.body)
    .then(() => {
        res.end()
    })
    .catch(err => console.log(err))
})

router.post('/login', (req, res) => {
    loginUser(req.body)
    .then(() => {
        res.end()
    })
    .catch(err => console.log(err))
})


module.exports = router