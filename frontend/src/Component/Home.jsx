import React from 'react'
import {useSelector} from 'react-redux'
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

function Home() {
  const user = useSelector((state) => state.user);

  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove('userToken'); 
    navigate('/login');
  };
  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-">
      <div className="form bg-gray-900 p-8 rounded-lg shadow-md w-80">
        <h1 className="text-2xl text-white font-bold mb-4">Welcome<p>{user?.name}</p></h1>
        <img
         
          alt="Profile"
          src={user?.profileImg}
          className="w-32 h-32 rounded-full mx-auto mb-4 text-white"
        />
        <p className="text-white mb-2">Name:<p>{user?.name}</p> </p>
        
        <p className="text-white mb-4">Email:<p>{user?.email}</p></p>
        

        <button
        onClick={handleLogout}
          
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </div>
    </div>
  )
}

export default Home
