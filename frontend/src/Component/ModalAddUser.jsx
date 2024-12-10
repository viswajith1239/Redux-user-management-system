import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import axios from "axios";
import { adminAxiosInstance } from "../Redux/axiosinterceptor";

export default function ResponsiveDialog({ SetaddUser, addUserTolist }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [data, setData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    profileImage: null,
  });

  const handleClose = () => SetaddUser(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setData((prevData) => ({
        ...prevData,
        profileImage: file,
      }));
    }
  };

  const handleOk = async () => {
    const response = await adminAxiosInstance.get("/admin/authenticated");
    const userId = response.data?.data?._id + "";
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("mobile", data.mobile);
    formData.append("password", data.password);
    formData.append("userId", userId);
    formData.append("profileImage", data.profileImage);

    try {
      const response = await axios.post(
        "http://localhost:3000/admin/imageupload",
        formData
      );
      addUserTolist(response.data.data);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      SetaddUser(false);
    }
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={true}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle
        id="responsive-dialog-title"
        style={{ backgroundColor: "#15172b", color: "#fff" }}
      >
        {"Add User Details"}
      </DialogTitle>

      <DialogContent style={{ backgroundColor: "#15172b", color: "#fff" }}>
        <TextField
          label="Name"
          name="name"
          value={data.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputProps={{
            style: { color: "#fff" }, 
          }}
          InputLabelProps={{
            style: { color: "#fff" }, 
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#fff", 
              },
              "&:hover fieldset": {
                borderColor: "#fff", 
              },
              "&.Mui-focused fieldset": {
                borderColor: "#fff", 
              },
            },
          }}
        />

        <TextField
          label="Email"
          name="email"
          type="email"
          value={data.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputProps={{
            style: { color: "#fff" },
          }}
          InputLabelProps={{
            style: { color: "#fff" },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#fff",
              },
              "&:hover fieldset": {
                borderColor: "#fff",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#fff",
              },
            },
          }}
        />

        <TextField
          label="Mobile"
          name="mobile"
          type="number"
          value={data.mobile}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputProps={{
            style: { color: "#fff" },
          }}
          InputLabelProps={{
            style: { color: "#fff" },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#fff",
              },
              "&:hover fieldset": {
                borderColor: "#fff",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#fff",
              },
            },
          }}
        />

        <TextField
          label="Password"
          name="password"
          type="password"
          value={data.password}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputProps={{
            style: { color: "#fff" },
          }}
          InputLabelProps={{
            style: { color: "#fff" },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#fff",
              },
              "&:hover fieldset": {
                borderColor: "#fff",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#fff",
              },
            },
          }}
        />

        <input
          type="file"
          name="profileImage"
          onChange={handleFileChange}
          style={{ color: "#fff" }} 
        />
      </DialogContent>
      <DialogActions
       style={{ backgroundColor: "#15172b"}}
      >
        <Button autoFocus onClick={handleClose}
        sx={{
          marginTop: 4,
          backgroundColor: 'red',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '8px',
          '&:hover': {
            backgroundColor: 'blue.700',
          },
        }}>
        
          Cancel
        </Button>
        <Button onClick={handleOk} autoFocus
        sx={{
          marginTop: 4,
          backgroundColor: 'blue',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '8px',
          '&:hover': {
            backgroundColor: 'blue.700',
          },
        }}>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}
