import "./Signup.css";
import {useEffect,useState} from 'react';
import {axiosInstance} from '../Redux/axiosinterceptor'
import {useNavigate} from 'react-router-dom'
import axios from "axios";

function Signup() {
  const [signupData, setSignupData]=useState({
    Name:"",
    Email:"",
    mobile:"",
    password:"",
    profileImage: null,
    profileImagePreview: null,

  })

  const [error, setError] = useState({
    Name: "",
    Email: "",
    password: "",
    mobile: "",
    profileImage: "",
  });
  const onChangeData = (field, value) => {
    setSignupData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  

  const navigate = useNavigate();
  const setValidationErr = (key, value) => {
    setError((rest) => ({
      ...rest,
      [key]: value,
    }));
    return false;
  };

  const validate = () => {
    const nameRegex = /^[A-Za-z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let flag = true;

    if (!signupData.Name.trim()) {
      setValidationErr("Name", " name is required");
      flag = false;
    }
    if (!nameRegex.test(signupData.Name)) {
      setValidationErr(
        "Name",
        " name should only contain letters and spaces"
      );
      flag = false;
    }


    if (!signupData.Email.trim()) {
      setValidationErr("Email", "Email ID is required");
      flag = false;
    }
    if (!emailRegex.test(signupData.Email)) {
      setValidationErr("Email", "Enter a valid Email ID");
      flag = false;
    }

    if (!signupData.password.trim()) {
      setValidationErr("password", "Password is required");
      flag = false;
    }
    if (signupData.password.length < 6) {
      setValidationErr(
        "password",
        "Password length must be at least 6 characters"
      );
      flag = false;
    }

    if (!signupData.mobile.trim()) {
      setValidationErr("mobile", "Mobile number is required");
      flag = false;
    }
    if (!/^\d+$/.test(signupData.mobile)) {
      setValidationErr("mobile", "Enter a valid mobile number");
      flag = false;
    }

    return flag;
  };

  const submitSignup = async (e) => {
    e.preventDefault(); 
    if (validate()) {
    try {
      const { data } = await axiosInstance.post("/user/signup", signupData);
      console.log(data);
      if (data.status) {
        const formData = new FormData();
        formData.append("profileImage", signupData.profileImage);
        formData.append("userId", data.data._id);
        console.log("before image upload");
        const response = await axios.post(
          "http://localhost:3000/user/imageupload",
          formData
        );
        console.log(response, "image upload response");
        console.log("navigating to loginpage");
        
        navigate("/login");
      } 
    } catch (error) {
      console.log("There was an error ", error);
    }
  }
  };
  

  useEffect(() => {
    return () => {
      if (signupData.profileImagePreview) {
        URL.revokeObjectURL(signupData.profileImagePreview);
      }
    };
  }, [signupData.profileImagePreview]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSignupData((prev) => ({
        ...prev,
        profileImage: file,
        profileImagePreview: URL.createObjectURL(file),
      }));
    }
  };
  return (
    <div className="flex items-center justify-center">
      <form className="form" onSubmit={submitSignup}>
        <div className="title">Welcome</div>
        <div className="subtitle">Let's create your account!</div>

        <div className="input-container ic1">
          <label className="label" htmlFor="name">Name</label>
          <input type="text" className="input" id="name"  onChange={(e) => onChangeData("Name", e.target.value)}/>
          {error.Name && <p style={{ color: "red" }}>{error.Name}</p>}
        </div>

        
        <div className="input-container ic1">
          <label className="label" htmlFor="email">Email</label>
          <input type="email" className="input" id="email" onChange={(e) => onChangeData("Email", e.target.value)} />
          {error.Email && <p style={{ color: "red" }}>{error.Email}</p>}
        </div>

       
        <div className="input-container ic2">
          <label className="label" htmlFor="phone">Phone Number</label>
          <input type="number" className="input" id="mobile" onChange={(e) => onChangeData("mobile", e.target.value + "")} />
          {error.mobile && <p style={{ color: "red" }}>{error.mobile}</p>}
        </div>

     
        <div className="input-container ic2">
          <label className="label" htmlFor="password">Password</label>
          <input type="password" className="input" id="password"  onChange={(e) => onChangeData("password", e.target.value)}/>
          {error.password && <p style={{ color: "red" }}>{error.password}</p>}
        </div>
        <div>
  <label className="text-white">Profile Image</label>
  <input 
    type="file" 
    accept="image/*" 
    onChange={handleFileChange} 
    className="text-white file:bg-gray-800 file:text-white file:border-none file:py-2 file:px-4 file:rounded file:cursor-pointer" 
  />
  {signupData.profileImagePreview && (
    <div className="mt-2">
      <img
        src={signupData.profileImagePreview}
        alt="Profile Preview"
        className="w-24 h-24"
      />
    </div>
  )}
</div>


      
      
        
     
        <button className="submit" type="submit" >Signup</button>
        
        
        <p style={{ marginTop: "10px", color:"white"}}>
          Already registered?{" "}
          <a
            href="/login"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            Go to Login
          </a>
        </p>
      </form>
    </div>
  );
}

export default Signup;
