
exports.retrieveAvatars = async (client) => {
    try {
        const query = {
            text: 'SELECT * FROM avatars',
        };
        const result = await client.query(query)
        console.log(result)
        if (result.rows.length >= 1) {
            return result.rows
        } else {
            throw `Error while retrieving avatars...`
        }
    } catch(err) {
        console.error(err)
        throw err
    }
}

exports.insertCharacter = async (characterData, client) => {
    try {
        const query = {
            text: 'INSERT INTO characters(user_id, avatar_id, gender, class, skills, bio) VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
            values: [
                characterData.user_id, 
                characterData.avatar_id, 
                characterData.gender, 
                characterData.class, 
                characterData.skills, 
                characterData.bio
            ]
        }
        
        const result  = await client.query(query)
        console.log('Character inserted:', result.rows[0] )
        return result.rows[0]
    }catch(err){
        throw err
    }
}

exports.retrieveIntroImages = async (client) => {
    try {
        const query = {
            text: 'SELECT * FROM intro_images'

        }
         const result = await client.query(query)
        if (result.rows.length >= 1) {
            return result.rows
        } else {
            throw {message: `Error while retrieving intro images...`}
        }
    } catch(err) {
        throw err
    }
}