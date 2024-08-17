const {retrieveAvatars} = require('../dbOps/dbOpsCharacter.js')
const {client} = require('../config/db.js')

exports.getAvatars = async () => {
    try {
        let avatars = await retrieveAvatars(client)
        return avatars
    }catch(err){
        console.log(err)
    }
}