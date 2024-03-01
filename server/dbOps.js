const bcrypt = require('bcryptjs')
const keyConstants = require('./config/constants.js')



exports.insertUser = async (username, email, password, client) => {
    try {
        password = await bcrypt.hash(userData.password, keyConstants.SALT_ROUNDS)
        const query = {
            text: 'INSERT INTO users(username, email, password) VALUES($1, $2, $3) RETURNING id, username, email, created_at, updated_at',
            values: [username, email, password]
        }

        const result  = await client.query(query)
        console.log('User inserted:', result.rows[0] )
    }catch(err){
        console.log(err)
        throw err
    }
}

exports.retrieveUser = async (username, email, password, client) => {
    try {
        const query = {
            text: 'SELECT * FROM users WHERE username = $1 AND email = $2 ',
            values: [username, email]
        };

        const result = await client.query(query)
        if (result.rows.length === 1) {
            let isPassCorrect = await bcrypt.compare(password, result.rows[0].password)
            if(isPassCorrect){
                console.log(result.rows[0])
            }else {
                throw `Wrong login information!`
            }
        } else {
            throw `Wrong login information!`
        }
    } catch(err) {
        console.error(err)
        throw err
    }
}

exports.emailExists = async (email, client) => {
    try {
        const data = await client.query("SELECT * FROM users WHERE email=$1", [
            email,
          ]);
          if (data.rowCount == 0) return false; 
          return data.rows[0];
    }catch(err){
        console.log(err)
        throw err
    }
  };