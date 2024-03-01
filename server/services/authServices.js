const {
    insertUser,
    emailExists
} = require("../dbOps")
const bcrypt = require('bcryptjs')
const keyConstants = require('../config/constants')
const client = require('../config/db.js')

exports.registerUser = async (userData) => {
    try{
        let isExisting = await emailExists(userData.email)
        if(isExisting){
            throw new Error(`Email is already in use!`)
        }else{
            let hashedPass = await bcrypt.hash(userData.password, keyConstants.SALT_ROUNDS)
            await insertUser(userData.username, userData.email, hashedPass)
        }
    }catch(err){
        console.log(err)
    }finally{
        client.end()
    }
}