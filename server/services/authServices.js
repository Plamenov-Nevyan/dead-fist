const {
    insertUser,
    retrieveUser,
    emailExists
} = require("../dbOps")
const {client} = require('../config/db.js')

exports.registerUser = async (userData) => {
    try{
        let isExisting = await emailExists(userData.email, client)
        console.log(isExisting)
        if(isExisting){
            throw new Error(`Email is already in use!`)
        }else{
            await insertUser(userData.username, userData.email, hashedPass, client)
        }
    }catch(err){
        console.log(err)
    }
}

exports.loginUser = async (userData) => {
    try {
        await retrieveUser(userData.username, userData.email, userData.password, client)
    }catch(err){

    }
}