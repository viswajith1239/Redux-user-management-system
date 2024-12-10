const jwt = require("jsonwebtoken");
const secretKey = "your-secret-key";

const generateToken = (userData) => {
  const payload = {
    id: userData._id + "",
    name: userData.name,
    email: userData.email,
    role: userData.isAdmin ? "admin" : "user",
  };
  console.log(payload);
  return jwt.sign(payload, secretKey, { expiresIn: "1d" });
};

module.exports = generateToken;
