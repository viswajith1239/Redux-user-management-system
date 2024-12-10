// import axios from 'axios'
// import cookies from 'js-cookie'

// export const axiosInstance = axios.create({
//     baseURL: 'http://localhost:3000',  
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': cookies.get("userToken"),    
//     },
//   });
  
//   export const adminAxiosInstance = axios.create({
//     baseURL: 'http://localhost:3000',  
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': cookies.get("adminToken"),    
//     },
//   })


  import axios from 'axios';
import cookies from 'js-cookie';

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
      'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use((config) => {
    const token = cookies.get("userToken");
    if (token) {
        config.headers['Authorization'] = token;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const adminAxiosInstance = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
      'Content-Type': 'application/json',
    },
});

adminAxiosInstance.interceptors.request.use((config) => {
    const adminToken = cookies.get("adminToken");
    if (adminToken) {
        config.headers['Authorization'] = adminToken;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
