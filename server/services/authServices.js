const {
    insertUser,
    retrieveUser,
    emailExists
} = require("../dbOps")
const {client} = require('../config/db.js')

exports.registerUser = async (userData) => {
    console.log(userData)
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
        let user = await retrieveUser(userData.username, userData.email, userData.password, client)
        return user
    }catch(err){

    }
}