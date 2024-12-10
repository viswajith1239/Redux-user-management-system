const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dxop0bbkp",
  api_key: "837543797151944",
  api_secret: "KSsGGyohFW2YdK_wnDJdPjMWB88",
});

const uploadImage = async (file) => {
  try {
    const data = await cloudinary.uploader.upload(file.filepath, {
      folder: "uploads",
    });
    console.log(data)
    return data.secure_url;
  } catch (error) {
    console.log(error)
    return null
  }
};

module.exports = uploadImage;