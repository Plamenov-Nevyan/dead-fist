
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