import React from 'react'
import { useNavigate,Link } from 'react-router-dom'

export default function Match() {
    const navigate =useNavigate()
  return (
    <div>
      Finding another player ...
      <Link to="/problem"><button>Start Battle</button></Link>
    </div>
  )
}
