const {
    insertUser,
    retrieveUser,
    emailExists,
    usernameExists
} = require("../dbOps/dbOps.js")
const {client} = require('../config/db.js')

exports.registerUser = async (userData) => {
    try{
        let [isEmailExisting, isUsernameExisting] = await Promise.all([
            emailExists(userData.email, client),
            usernameExists(userData.username, client)
        ])
        if(isEmailExisting){
            throw {message: `Email is already in use!`}
        }else if(isUsernameExisting){
            throw {message: `Username is already in use!`}
        }else{
           let user = await insertUser(userData.username, userData.email, userData.password, client)
           return user
        }
    }catch(err){
        throw err
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