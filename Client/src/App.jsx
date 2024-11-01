import React from 'react'
import Login from './Components/Login/Login.jsx'
import './index.css'
import HomePage from './Components/HomePage/HomePage.jsx'
import {RouterProvider,createBrowserRouter} from 'react-router-dom'
import Match from './Components/Matching/Match.jsx'
import Problem from './Components/Problem/Problem.jsx'
import Profile from './Components/Profile/Profile.jsx'
const router=createBrowserRouter([
  {
      path:"/",
      element:<Login/>
  },
  {
      path:"/home",
      element:<HomePage/>
  },
  {
    path:"/match",
    element:<Match/>
  },
  {
    path:"/problem",
    element:<Problem/>
  },
  {
    path:"/profile",
    element:<Profile/>
  }
  
]
)

export default function App() {
  return (
    <div>
      <RouterProvider router={router}/>
    </div>
  )
}
