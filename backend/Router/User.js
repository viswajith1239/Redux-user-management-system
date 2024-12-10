// ./Router/User.js
const express = require('express');
const router = express.Router();
const userController = require("../Controllers/UserController");
const {authenticateJWT}=require("../Middleware/authMiddleware")



router.post("/signup", userController.signup);
router.post("/imageupload",userController.imageupload)
router.post("/login",userController.login)
router.get("/authenticated",authenticateJWT,userController.isauthenticated)


module.exports = router;
