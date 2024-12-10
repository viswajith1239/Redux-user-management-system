const jwt = require("jsonwebtoken");
const secretKey = "your-secret-key";

const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Access denied, token missing!" });
  }
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = decoded;
    next();
  });
};

const adminAuthenticateJWT = (req, res, next) => {
  const token = req.headers.authorization;
  console.log("token...........",token)
  if (!token) { return res.status(401).json({ message: "Access denied, token missing!" }); }
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = decoded;
    next();
  });
};

module.exports = { authenticateJWT, adminAuthenticateJWT };
