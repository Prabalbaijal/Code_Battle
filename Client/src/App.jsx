import React, { useEffect } from 'react';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setLoggedinUser } from './redux/userSlice.js';
import router from './Components/Routes.jsx';
import { useState } from 'react';
import SocketInitialiser from './Components/SocketInitialiser.jsx';


export default function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    axios.get(`${BACKEND_URL}/api/users/getUser`, { withCredentials: true }) 
        .then(res => {
            if (res.data) {
                dispatch(setLoggedinUser(res.data));
            }
        })
        .catch(() => dispatch(setLoggedinUser(null)))
        .finally(()=>{
          setLoading(false);
        })
}, [dispatch]);

  if (loading) return <h2>Loading...</h2>;

  return (

    <div>
      <RouterProvider router={router} >
        <SocketInitialiser/>
      </RouterProvider>
    </div>
  );
}
