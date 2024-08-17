const express = require('express')
const router = express.Router()
const authController = require('./controllers/authController')
const characterController = require('./controllers/characterController')


router.use('/auth', authController)
router.use('/character', characterController)

module.exports = router