const User=require("../model/UserModel")
const bcrypt = require("bcrypt");
const { IncomingForm } = require("formidable");
const uploadImage = require("../cloudinaryConfig");
const generateToken = require("../jsonWebToken");

const signup = async (req, res) => {
    try {
      console.log("-------", req.body);
      const existinguser = await User.findOne({ email: req.body.Email });
      if (existinguser) {
        return res
          .status(200)
          .json({ status: false, message: "user already exist" });
      } else {
        const hashedpassword = await bcrypt.hash(req.body.password, 10);
        const newUser = await User.insertMany({
          name: req.body.Name,
          email: req.body.Email,
          mobile: req.body.mobile,
          password: hashedpassword,
          isAdmin: false,
          
          isBlocked: false,
        });
  
        return res.status(201).json({
          status: true,
          message: "user has registered successfully",
          data: newUser[0],
        });
      }
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ status: false, message: "error registration", error });
    }
  };

  // const imageupload = async (req, res) => {
  //   try {
  //     const form = new IncomingForm();
  //     form.parse(req, async (err, fields, files) => {
  //       if (err) {
  //         return res.status(400).json({ message: "Invalid form data" });
  //       }
        
  //       const profileImg = files.profileImage; // Removed [0]
  //       const url = await uploadImage(profileImg);
  //       const userId = fields.userId; // Removed [0]
  //       const userData = await User.findById(userId);
        
  //       if (!userData) {
  //         return res.status(404).json({ message: "User not found" });
  //       }
  
  //       userData.profileImg = url;
  //       await userData.save();
  //       console.log(url, fields);
  //       res.status(200).json({ message: "Image uploaded successfully" });
  //     });
  //   } catch (error) {
  //     console.error("Image upload error:", error);
  //     return res.status(500).json({ message: "Server error", error });
  //   }
  // };
  
  const imageupload = async (req, res) => {
    try {
      
      const form = new IncomingForm();
      form.parse(req, async (err, fields, files) => {
        console.log("hi",files);
        
        const profileImg = files.profileImage[0];
        console.log("hello",profileImg);
        
        const url = await uploadImage(profileImg);
        const userId = fields.userId[0];
        const userData = await User.findById(userId);
        userData.profileImg = url;
        await userData.save();
        console.log(url, fields);
        res.status(200).json({ message: "Image uploaded successfully" });
      });
    } catch (error) {
      console.error("Image upload error:", error);
      return res.status(500).json({ message: "Server error", error });
    }
  };

  const login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const userData = await User.findOne({ email });
      if (userData) {
        const ismatch = await bcrypt.compare(password, userData.password);
        if (ismatch) {
          return res.status(200).json({
            message: "login successful",
            user: userData,
            token: generateToken(userData),
          });
        } else {
          return res.status(400).json({ message: "invalid user" });
        }
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "login error", error });
    }
  };

  const isauthenticated = async (req, res) => {
    try {
      if (req.user) {
        const userData = await User.findById(req.user.id);
        res.status(200).json({ status: true, message: "success", userData });
      } else {
        res.status(200).json({ status: false, message: "failed" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Server error", err });
    }
  };

  module.exports={
    signup,
    imageupload,
    login,
    isauthenticated,
  }