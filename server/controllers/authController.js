const express = require('express')
const {registerUser} = require("../services/authServices.js")
const router = express.Router()

router.post('/register', (req, res) => {
    registerUser(req.body)
    .then(() => {
        res.end()
    })
    .catch(err => console.log(err))
})

router.post('/login', (req, res) => {

})


module.exports = router