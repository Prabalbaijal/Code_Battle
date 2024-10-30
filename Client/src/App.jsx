import React from 'react'
import Login from './Components/Login/Login.jsx'
import './index.css'
import Dashboard from './Components/Dashboard.jsx'
import {RouterProvider,createBrowserRouter} from 'react-router-dom'

const router=createBrowserRouter([
  {
      path:"/",
      element:<Login/>
  },
  {
      path:"/dashboard",
      element:<Dashboard/>
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
