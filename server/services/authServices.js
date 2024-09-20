const {
  insertUser,
  retrieveUser,
  emailExists,
  usernameExists,
  editCharCreation,
} = require("../dbOps/dbOps.js");
const { client } = require("../config/db.js");

exports.registerUser = async (userData) => {
  try {
    let [isEmailExisting, isUsernameExisting] = await Promise.all([
      emailExists(userData.email, client),
      usernameExists(userData.username, client),
    ]);
    if (isEmailExisting) {
      throw { message: `Email is already in use!` };
    } else if (isUsernameExisting) {
      throw { message: `Username is already in use!` };
    } else {
      let user = await insertUser(
        userData.username,
        userData.email,
        userData.password,
        client
      );
      return user;
    }
  } catch (err) {
    throw err;
  }
};

exports.loginUser = async (userData) => {
  try {
    let user = await retrieveUser(userData.email, userData.password, client);
    return user;
  } catch (err) {
    throw err;
  }
};

exports.confirmCharCreated = async (userId) => {
  try {
    await editCharCreation(userId, client);
  } catch (err) {
    throw err;
  }
};
