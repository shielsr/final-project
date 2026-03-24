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
            <h1 className="text-center my-4"><NavLink to="/record">Overnote</NavLink></h1>
            <h2 className="text-center my-4">The notetaking app for songwriters</h2>
            <ul>
                {isLoggedIn ? (
                    <>
                        <li><NavLink to="/audio">My files</NavLink></li>
                        <li><NavLink to="/record">Record</NavLink></li>
                        <li><NavLink to="/projects">Projects</NavLink></li>
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