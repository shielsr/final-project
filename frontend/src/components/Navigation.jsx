import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'

const Navigation = () => {
  const { isLoggedIn, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav>
      <h1><NavLink to="/">Overnote</NavLink></h1>
      <ul>
        {isLoggedIn ? (
          <>
            <li><NavLink to="/record">Record</NavLink></li>
            <li><button onClick={handleLogout}>Logout</button></li>
          </>
        ) : (
          <>
            <li><NavLink to="/register">Register</NavLink></li>
            <li><NavLink to="/login">Login</NavLink></li>
          </>
        )}
      </ul>
    </nav>
  )
}

export default Navigation