
const User = require("../model/UserModel");
const bcrypt = require("bcrypt");
const generateToken = require("../jsonWebToken");
const uploadImage = require("../cloudinaryConfig");
const { IncomingForm } = require("formidable");

const adminLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      const userdata = await User.findOne({ email });
      if (!userdata) {
        return res.status(400).json({ status: false, message: "user not found" });
      }
      if (!userdata.isAdmin) {
        return res
          .status(403)
          .json({ status: false, message: "unauthorized user" });
      }
      const ismatch = await bcrypt.compare(password, userdata.password);
      const token = generateToken(userdata);
      if (ismatch) {
        return res.status(200).json({
          status: true,
          message: "admin logged successfully",
          token,
        });
      } else {
        return res.status(400).json({ status: false, message: invalid });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ status: false, message: "login error", error });
    }
  };

  const getUsers = async (req, res) => {
    try {
      const user = await User.find({ isAdmin: false }); 
      
      console.log(user,"hello");
      
      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ message: "error fetching data", error });
    }
  };
  
  const isauthenticated = async (req, res) => {
    try {
      const adminData = await User.findById(req.user.id);
      console.log(adminData, req.user);
      if (req.user) {
        if (req.user.role === "admin") {
          res
            .status(200)
            .json({ status: true, message: "success", data: adminData });
        } else {
          res.status(200).json({ status: false, message: "user unauthorized" });
        }
      } else {
        res.status(200).json({ status: false, message: "failed" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Server error", err });
    }
  };

  const deleteUser = async (req, res) => {
    try {
      console.log(req.query);
      await User.findByIdAndDelete(req.query.userid);
      res.status(200).json({ status: true, message: "success" });
    } catch (err) {
      console.log(err);
    }
  };
  


const addUser = async (req, res) => {
  const { name, email, mobile, password } = req.body;
  const profileImage = req.file?.path; 

  try {
   
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

   
    const newUser = new User({
      name,
      email,
      mobile,
      password: hashedPassword,
      profileImage, 
    });

    await newUser.save();

    res.status(201).json({ message: 'User added successfully', user: newUser });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ message: 'Error adding user' });
  }
};


  const imageupload = async (req, res) => {
    try {
      const form = new IncomingForm();
      form.parse(req, async (err, fields, files) => {
        console.log(err, fields, files);
        const profileImg = files.profileImage[0];
        const url = await uploadImage(profileImg);
        const userData = await User.insertMany({
          name: fields.name[0],
          email: fields.email[0],
          password: await bcrypt.hash(fields.password[0], 10),
          mobile: fields.mobile[0],
          isAdmin: false,
          isBlocked: false,
          profileImg: url,
        });
        console.log(url, fields);
        res
          .status(200)
          .json({ message: "Image uploaded successfully", data: userData[0] });
      });
    } catch (error) {
      console.error("Image upload error:", error);
      return res.status(500).json({ message: "Server error", error });
    }
  };

  const edituser = async (req, res) => {
    const { name, email, mobile } = req.body;
    const profileImg = req.file ? req.file.path : null; 

    try {
        if (profileImg) {
            const result = await cloudinary.uploader.upload(profileImg, {
                folder: "user_profiles", 
            });
            await User.findByIdAndUpdate(req.body._id, {
                name,
                email,
                mobile,
                profileImg: result.secure_url, 
            });
        } else {

            await User.findByIdAndUpdate(req.body._id, {
                name,
                email,
                mobile,
            });
        }
        return res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ error: "Server error" });
    }
};


  module.exports={
    adminLogin,
    isauthenticated,
    getUsers,
    deleteUser,
    addUser,
    imageupload,
    edituser,
  }