import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useState, useEffect } from "react";
import { axiosInstance } from "../Redux/axiosinterceptor";

export default function ResponsiveDialog({ edituser, setEditUser, editedusr }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [data, setData] = useState({
    name: "",
    email: "",
    mobile: "",
    profileImage: null, 
    imagePreview: null,  
  });

  useEffect(() => {
    if (edituser) {
      setData({
        name: edituser.name || "",
        email: edituser.email || "",
        mobile: edituser.mobile || "",
        profileImage: null,  
        imagePreview: edituser.profileImg || null, 
      });
    }
  }, [edituser]);

  const handleClose = () => setEditUser("");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevdata) => ({
      ...prevdata,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setData((prevdata) => ({
          ...prevdata,
          profileImage: file,  
          imagePreview: reader.result, 
        }));
      };
      reader.readAsDataURL(file); 
    }
  };

  const handleOk = async () => {
    try {
        const formData = new FormData();
        formData.append("_id", edituser._id);
        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("mobile", data.mobile);
        if (data.profileImage) {
            formData.append("profileImage", data.profileImage);
        }

        await axiosInstance.post("/admin/userEdit", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

       
        editedusr({ 
            name: data.name,
            email: data.email,
            mobile: data.mobile,
            profileImg: data.imagePreview 
        }, edituser._id);

        handleClose(); 
    } catch (error) {
        console.log("error updating user", error);
    }
};


  return (
    <React.Fragment>
      <Dialog
        fullScreen={fullScreen}
        open={!!edituser}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle
          id="responsive-dialog-title"
          sx={{ backgroundColor: "#15172b", color: "#fff" }}
        >
          {"Edit User Details"}
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: "#15172b", color: "#fff" }}>
          <input
            type="text"
            name="name"
            value={data.name}
            onChange={handleChange}
            placeholder="Name"
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "16px",
              color: "#fff",
              backgroundColor: "#15172b",
              borderColor: "#fff",
              borderWidth: "1px",
              borderRadius: "4px",
            }}
          />
          <input
            type="text"
            name="email"
            value={data.email}
            onChange={handleChange}
            placeholder="Email"
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "16px",
              color: "#fff",
              backgroundColor: "#15172b",
              borderColor: "#fff",
              borderWidth: "1px",
              borderRadius: "4px",
            }}
          />
          <input
            type="text"
            name="mobile"
            value={data.mobile}
            onChange={handleChange}
            placeholder="Mobile"
            style={{
              width: "100%",
              padding: "8px",
              color: "#fff",
              backgroundColor: "#15172b",
              borderColor: "#fff",
              borderWidth: "1px",
              borderRadius: "4px",
            }}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange} 
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "16px",
              color: "#fff",
              backgroundColor: "#15172b",
              borderColor: "#fff",
              borderWidth: "1px",
              borderRadius: "4px",
            }}
          />
          {data.imagePreview && (
            <img
              src={data.imagePreview}
              alt="Profile Preview"
              style={{
                width: "100%",
                marginTop: "16px",
                borderRadius: "4px",
              }}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "#15172b" }}>
          <Button
            autoFocus
            onClick={handleClose}
            sx={{
              backgroundColor: "red",
              color: "white",
              padding: "8px 16px",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "red.700",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleOk}
            autoFocus
            sx={{
              backgroundColor: "blue",
              color: "white",
              padding: "8px 16px",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "blue.700",
              },
            }}
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
