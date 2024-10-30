import React from 'react'
import Login from './Components/Login/Login.jsx'
import './index.css'
import HomePage from './Components/HomePage/HomePage.jsx'
import {RouterProvider,createBrowserRouter} from 'react-router-dom'

const router=createBrowserRouter([
  {
      path:"/",
      element:<Login/>
  },
  {
      path:"/home",
      element:<HomePage/>
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
