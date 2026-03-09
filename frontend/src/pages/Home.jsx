import { useAuth } from '../AuthContext'

const Home = () => {
  const { isLoggedIn, username } = useAuth()
  return (
    <h2>
      {isLoggedIn
        ? `Welcome, ${username}! You're logged in.`
        : 'Hi, please log in (or register) to use the site'}
    </h2>
  )
}

export default Home