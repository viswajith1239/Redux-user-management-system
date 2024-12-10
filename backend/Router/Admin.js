const express=require("express")
const router=express.Router()


const adminController = require("../Controllers/AdminControllers")
const { adminAuthenticateJWT } = require("../Middleware/authMiddleware");
router.post("/login", adminController.adminLogin);
router.get( "/authenticated",adminAuthenticateJWT,adminController.isauthenticated);
router.get("/getUsers", adminController.getUsers);
router.delete("/deleteUser", adminController.deleteUser);
router.post("/adduser",adminController.addUser)
router.post("/imageupload",adminController.imageupload)
router.post("/userEdit", adminController.edituser);
module.exports=router