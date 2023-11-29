const { db } = require("../config/db.js");

const getUser = (username) => {
  return db("users").select("id", "username", "password").where({ username });
};

const addUser = (username, password) => {
  return db("users")
    .insert({ username, password })
    .returning(["id", "username", "password"]);
};

module.exports = {
  getUser,
  addUser,
};
