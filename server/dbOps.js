const client = require('./config/db.js')
client.connect()



exports.insertUser = async (username, email, password) => {
    try {
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

exports.emailExists = async (email) => {
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