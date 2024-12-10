import './App.css';
import {useEffect,useState,memo} from 'react'
import { BrowserRouter as Router, Routes, Route,Navigate } from 'react-router-dom';
import Login from './Component/Login';
import Signup from './Component/Signup';
import Home from './Component/Home';
import AdimnLogin from './Component/AdimnLogin';
import AdminHome from './Component/AdminHome';
import "./index.css"
import {useDispatch,useSelector} from "react-redux"
import cookies from "js-cookie"
import {adminAxiosInstance,axiosInstance} from "./Redux/axiosinterceptor"
import {setUser} from "./Redux/Slice"

function ProtectedRoute({iflogged,notlogged}){
  const [isAuthenticated,setIsAuthenticated]=useState(null)

  const token=cookies.get("userToken")
  const dispatch=useDispatch()

  useEffect(()=>{
    const checkAuthentication= async()=>{
      if(token){
        try {
          const {data}=await axiosInstance.get("/user/authenticated")
          if(data.userData){
            dispatch(setUser(data.userData))
            setIsAuthenticated(data.status)
          }else{
            setIsAuthenticated(false)
            cookies.remove("userToken")
          }
        } catch (e) {
          console.log(e.message);
          setIsAuthenticated(false)
          
        }
      }else{
        setIsAuthenticated(false)
      }
    }
    checkAuthentication()
  },[token])

  if(isAuthenticated===null){
    return <div>loading...</div>
  }
  return isAuthenticated ? iflogged : notlogged
}

function AdminProtecedRoute({ ifAdminLogged, notAdminLogged }) {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(null);
  const adminToken = cookies.get("adminToken");
  useEffect(() => {
    const checkAdminAuthentication = async () => {
      if (adminToken) {
        try {
          const { data } = await adminAxiosInstance.get("/admin/authenticated");
          setIsAdminAuthenticated(data.status);
        } catch (e) {
          console.log(e.message);
          setIsAdminAuthenticated(false);
        }
      } else {
        setIsAdminAuthenticated(false);
      }
    };

    checkAdminAuthentication();
  }, [adminToken]);

  if (isAdminAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return isAdminAuthenticated ? ifAdminLogged : notAdminLogged;
}

function App() {
  // const userid=useSelector((state)=>state.user?._id)
  // console.log("user id....",userid);
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProtectedRoute
        iflogged={<Navigate to="/home"/>}notlogged={<Signup/>}/>}/>
         <Route path="/login" element={<ProtectedRoute
        iflogged={<Navigate to="/home"/>}notlogged={<Login/>}/>}/>
         <Route path="/home" element={<ProtectedRoute
        iflogged={<Home/>}notlogged={<Navigate to="/login"/>}/>}/>
         <Route path="/admin-login" element={<AdminProtecedRoute
        ifAdminLogged={<Navigate to="/admin-home"/>}notAdminLogged={<AdimnLogin/>}/>}/>
        {/* <Route path="/admin-login" element={<AdimnLogin />} /> */}
        <Route path="/signup" element={<Signup />} />
        
      


        <Route path="/admin-home" element={<AdminProtecedRoute ifAdminLogged={<AdminHome />} notAdminLogged={<Navigate to="/admin-login" />} />} />

      </Routes>
      
    </Router>
  );
}

export default memo (App);
