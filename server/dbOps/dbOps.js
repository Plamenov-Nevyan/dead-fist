const bcrypt = require('bcryptjs')
const keyConstants = require('../config/constants.js')



exports.insertUser = async (username, email, password, client) => {
    try {
        password = await bcrypt.hash(password, keyConstants.SALT_ROUNDS)
        const sessionSecret = await createSessionSecret(username, 'new', client)
        const query = {
            text: 'INSERT INTO users(username, email, password, session_secret) VALUES($1, $2, $3, $4) RETURNING id, username, email, created_at, session_secret',
            values: [username, email, password, sessionSecret]
        }
        
        const result  = await client.query(query)
        console.log('User inserted:', result.rows[0] )
        return result.rows[0]
    }catch(err){
        console.log(err)
        throw err
    }
}

exports.retrieveUser = async (email, password, client) => {
    try {
        const query = {
            text: 'SELECT username, email, id, session_secret, password, has_created_character, profile_picture FROM users WHERE email = $1',
            values: [email]
        };
        const result = await client.query(query)
        if (result.rows.length === 1) {
            let isPassCorrect = await bcrypt.compare(password, result.rows[0].password)
            if(isPassCorrect){
                const secret = await createSessionSecret(result.rows[0].username, 'new', client)
                return {...result.rows[0], secret}
            }else {
                 throw {message: 'Wrong email and/or password'}
            }
        } else {
             throw {message: 'Wrong email and/or password'}
        }
    } catch(err) {
        throw {message: 'Wrong email and/or password'}
    }
}

exports.editCharCreation = async (userId, client) => {
    try {
        const query = {
            text: 'UPDATE users SET has_created_character = true WHERE id = $1',
            values: [userId]
        }
        const res = await client.query(query)
    }catch(err){
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
        throw err
    }
  };

  exports.usernameExists = async (username, client) => {
    try {
        const data = await client.query("SELECT * FROM users WHERE username=$1", [
            username,
          ]);
          if (data.rowCount == 0) return false; 
          return data.rows[0];
    }catch(err){
        throw err
    }
  }

  async function createSessionSecret(username, changeOrNew, client){
    try {
        let secret = await bcrypt.hash(`${Math.random().toString(36).slice(2, 7)}`, keyConstants.SALT_ROUNDS)
       if(changeOrNew === 'change'){
            const query = {
                text: 'UPDATE users SET session_secret = $1 WHERE username = $2 RETURNING session_secret',
                values: [secret, username]
            }
            const result = await client.query(query)
            console.log(result.rows)
            return result.rows[0].session_secret
       }else {
        return secret
       }
    }catch(err){
        console.log(err)
    }
    
  }