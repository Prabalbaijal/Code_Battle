import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import HomePage from './Components/HomePage/HomePage'
import Login from './Components/Login/Login.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <App></App>
   <Login></Login>
   <HomePage></HomePage>
  </StrictMode>,
)
