import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Login from './Components/Login/Login.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
   <App></App>
   <Login></Login>
  </StrictMode>,
)
