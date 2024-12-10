import React from 'react'
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../Redux/axiosinterceptor";
import Cookies from "js-cookie";

function AdimnLogin() {

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
});
const [error, setError] = useState({
    email: "",
    password: "",
    general: "",
});
const navigate = useNavigate();

function onChangeData(key, value) {
    setLoginData((prev) => ({ ...prev, [key]: value }));
    setError((prev) => ({ ...prev, [key]: "" }));
}

const validateForm = () => {
    let isValid = true;
    if (!loginData.email) {
        setError((prev) => ({ ...prev, email: "Email is required." }));
        isValid = false;
    }
    if (!loginData.password) {
        setError((prev) => ({ ...prev, password: "Password is required." }));
        isValid = false;
    }
    return isValid;
};

const loginSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
        const response = await axiosInstance.post("/admin/login", loginData);
        if (response.status === 200 && response.data.token) {
            Cookies.set("adminToken", response.data.token);
            navigate("/admin-home");
        } else {
            setError({ general: "Login failed. Please check your credentials." });
        }
    } catch (error) {
        console.log("login error:", error);
        if (error.response && error.response.status === 400) {
            setError({
                email: "Invalid email  .",
                password: "Invalid  password.",
                general: "",
            });
        } else {
            setError({
                email: "Something went wrong. Please try again.",
                password: "Something went wrong. Please try again.",
                general: "Something went wrong. Please try again.",
            });
        }
    }
};
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
    <div className="form bg-gray-900 p-8 rounded-lg shadow-md w-80">
      <div className="title text-2xl font-bold text-center mb-2 text-white">Admin Login</div>
      <div className="subtitle text-gray-300 text-center mb-6">Login to your admin account</div>

      
      <form onSubmit={loginSubmit}>
      <div className="input-container mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="admin-email">Email</label>
        <input
          type="email"
          onChange={(e) => onChangeData("email", e.target.value)}
          className="input w-full p-2 border rounded-lg border-gray-700 focus:outline-none focus:border-blue-500 bg-gray-800 text-white"
          id="admin-email"
        />
         {error.email && <p className="text-red-500">{error.email}</p>}
      </div>

     
      <div className="input-container mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="admin-password">Password</label>
        <input
          type="password"
          onChange={(e) => onChangeData("password", e.target.value)}
          className="input w-full p-2 border rounded-lg border-gray-700 focus:outline-none focus:border-blue-500 bg-gray-800 text-white"
          id="admin-password"
        />
        {error.password && <p className="text-red-500">{error.password}</p>}
      </div>

     
      <button className="submit w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition" type="submit">
        Login as Admin
      </button>
      
      </form>
    
      
    </div>
  </div>
  )
}

export default AdimnLogin
