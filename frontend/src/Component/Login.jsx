import React from 'react';
import { useState } from "react";
import { axiosInstance } from "../Redux/axiosinterceptor";
import { useDispatch } from "react-redux";
import { setUser } from "../Redux/Slice";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom"; 

function Login() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  function onChangeData(key, value) {
    setLoginData((prev) => ({ ...prev, [key]: value }));
    setValidationErr(key, "");
  }

  const setValidationErr = (key, value) => {
    setError((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const validateForm = () => {
    let isValid = true;
    if (!loginData.email) {
      setValidationErr("email", "Email is required.");
      isValid = false;
    }
    if (!loginData.password) {
      setValidationErr("password", "Password is required.");
      isValid = false;
    }
    return isValid;
  };

  const loginSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await axiosInstance.post("/user/login", loginData);
      if (response.data.token) {
        Cookies.set("userToken", response.data.token);
        dispatch(setUser(response.data.user));
        navigate("/home"); 
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError({
          email: "Invalid email or password.",
          password: "Invalid email or password.",
        });
      } else {
        setError({
          email: "Something went wrong. Please try again.",
          password: "Something went wrong. Please try again.",
        });
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="form bg-gray-900 p-8 rounded-lg shadow-md w-80">
        <div className="title text-2xl font-bold text-center mb-2 text-white">Welcome Back</div>
        <div className="subtitle text-gray-300 text-center mb-6">Login to your account</div>

      
        <form onSubmit={loginSubmit}>
          <div className="input-container mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="email">Email</label>
            <input
              type="email"
              onChange={(e) => onChangeData("email", e.target.value)}
              className="input w-full p-2 border rounded-lg border-gray-700 focus:outline-none focus:border-blue-500 bg-gray-800 text-white"
              id="email"
            />
            {error.email && <p className="text-red-500">{error.email}</p>}
          </div>

         
          <div className="input-container mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="password">Password</label>
            <input
              type="password"
              onChange={(e) => onChangeData("password", e.target.value)}
              className="input w-full p-2 border rounded-lg border-gray-700 focus:outline-none focus:border-blue-500 bg-gray-800 text-white"
              id="password"
            />
            {error.password && <p className="text-red-500">{error.password}</p>}
          </div>

        
          <button className="submit w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition" type="submit">
            Login
          </button>
        </form>

       
        <p className="mt-4 text-center text-gray-300">
          Not registered yet?{" "}
          <a
            href="/signup"
            className="text-blue-400 hover:underline"
          >
            Go to Signup
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
