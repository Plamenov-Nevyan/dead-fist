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
            secret : user.session_secret,
            profile_picture: user.profile_picture
        }
        req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
                return res.status(500).send('Failed to save session');
            }
            res.json({ message: `Welcome back, ${user.username}!`, hasCreatedCharacter: user.has_created_character });
        });
    })
    .catch(err => res.status(403).json({message: err.message}))
})

router.post('/logout', (req, res) => {
    let usernameGoodbye = req.session.userData.username
    req.session.destroy(err => {
        if(err){
            return res.status(500).json({message: 'Failed to log out.. please try again or contact an admin!'})
        }

        res.clearCookie('connect.sid')
        res.status(200).json({message : `Goodbye ${usernameGoodbye}!`})
    })
})

router.post('/get-session', (req, res) => {
    try {
        if(req.body.property === 'all'){
            res.json(req.session)
        }else{
            res.json({[req.body.property]: req.session.userData[req.body.property]})
        }
    }catch(err){
        res.status(500).json({message: err.message})
    }
})

module.exports = router