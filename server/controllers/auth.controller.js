const bcrypt = require("bcrypt");
const { getUser, addUser } = require("../models/auth.model.js");
const jwt = require("jsonwebtoken");
const jwtSecretKey = process.env.JWT_SECRET_KEY;

//register
const register = async (req, res) => {
  const { username, password } = req.body;

  try {
    const responds = await getUser(username);
    if (responds.length > 0)
      return res.status(409).json({ error: "Username already exists" });

    const hash = await bcrypt.hash(password, 5);
    const newUser = {
      username,
      password: hash,
    };

    const resp = await addUser(newUser.username, newUser.password);
    if (resp.length > 0) {
      res.send({ message: `Successfully registered!`, id: resp[0].id });
    } else {
      return res.status(500).json({ error: "Something went wrong" });
    }
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};

//login

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const responds = await getUser(username);
    if (responds.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = responds[0];

    const result = await bcrypt.compare(password, user.password);
    if (result) {
      const token = jwt.sign(
        { id: user.id, username: user.username },
        jwtSecretKey,
        { expiresIn: "7d" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.send({
        message: `Hi ${username}, welcome back again!`,
        token: token,
        userId: user.id,
      });
    } else {
      res.status(404).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = { register, login };
