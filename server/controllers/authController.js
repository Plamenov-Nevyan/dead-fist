const express = require('express')
const {registerUser, loginUser} = require("../services/authServices.js")
const router = express.Router()

router.post('/register', (req, res) => {
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
                console.error('Session save error:', err);
                return res.status(500).send('Failed to save session');
            }
            res.json({ message: 'Signed up successfully' });
        });
    })
    .catch(err => console.log(err))
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
            res.json({ message: 'Logged in successfully' });
        });
    })
    .catch(err => console.log(err))
})

router.get('/get-session', (req, res) => {
    try {
        console.log(req.session)
        res.json(req.session)
    }catch(err){
        console.log(err)
    }
})

module.exports = router