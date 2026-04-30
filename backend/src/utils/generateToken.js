const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "agenda_secret_key_12345", {
    expiresIn: "7d",
  });
};

module.exports = generateToken;