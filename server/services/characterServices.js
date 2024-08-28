const {retrieveAvatars, insertCharacter} = require('../dbOps/dbOpsCharacter.js')
const {client} = require('../config/db.js')

exports.getAvatars = async () => {
    try {
        let avatars = await retrieveAvatars(client)
        return avatars
    }catch(err){
        console.log(err)
    }
}

exports.createCharacter = async (characterData) => {
    try {
        let charId = await insertCharacter(characterData, client)
        return charId
    }catch(err){
        throw err
    }
}