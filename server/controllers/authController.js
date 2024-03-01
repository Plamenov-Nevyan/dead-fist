const express = require('express')
const {registerUser, loginUser} = require("../services/authServices.js")
const router = express.Router()

router.post('/register', (req, res) => {
    registerUser(req.body)
    .then((user) => {
        req.session.userID = user.id
        req.session.username = user.username
        req.session.email = user.email
        req.session.secret = user.session_secret
        console.log(req.session)
        res.end()
    })
    .catch(err => console.log(err))
})

router.post('/login', (req, res) => {
    loginUser(req.body)
    .then((user) => {
        req.session.userID = user.id
        req.session.username = user.username
        req.session.email = user.email
        req.session.secret = user.session_secret
        res.end()
    })
    .catch(err => console.log(err))
})

router.get('/getSession', (req, res) => {
    res.json(req.session)
})

module.exports = router