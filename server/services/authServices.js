const {
    insertUser,
    retrieveUser,
    emailExists
} = require("../dbOps/dbOps.js")
const {client} = require('../config/db.js')

exports.registerUser = async (userData) => {
    try{
        let isExisting = await emailExists(userData.email, client)
        if(isExisting){
            throw new Error(`Email is already in use!`)
        }else{
           let user = await insertUser(userData.username, userData.email, userData.password, client)
           return user
        }
    }catch(err){
        console.log(err)
    }
}

exports.loginUser = async (userData) => {
    try {
        console.log(userData)
        let user = await retrieveUser(userData.username, userData.email, userData.password, client)
        return user
    }catch(err){

    }
}