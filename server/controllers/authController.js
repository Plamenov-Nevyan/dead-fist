const express = require('express')
const {registerUser, loginUser} = require("../services/authServices.js")
const authValidator=require('../middlewares/authValidator.js')
const schemas = require('../utils/JoiSchemas.js')
const router = express.Router()

router.post('/register', authValidator(schemas.authSchema), (req, res) => {
    registerUser(req.body)
    .then((user) => {
        req.session.userData = {
            userID : user.id,
            username : user.username,
            email : user.email,
            secret : user.session_secret
        }
        req.session.save((err) => {
            if (err) {
                throw {message: `Session save error: ${err}`};
            }
            res.json({ message: `Welcome to Dead Fist, ${user.username}!` });
        });
    })
    .catch(err => {
        console.log(err)
        res.status(403).json({message: err.message})
    })
})

router.post('/login', (req, res) => {
    loginUser(req.body)
    .then((user) => {
        req.session.userData = {
            userID : user.id,
            username : user.username,
            email : user.email,
            secret : user.session_secret
        }
        console.log(req.session)
        req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
                return res.status(500).send('Failed to save session');
            }
            res.json({ message: `Welcome back, ${user.username}!` });
        });
    })
    .catch(err => res.status(403).json({message: err.message}))
})

router.get('/get-session', (req, res) => {
    try {
        res.json(req.session)
    }catch(err){
        console.log(err)
    }
})

module.exports = router