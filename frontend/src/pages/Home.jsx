import { useAuth } from '../AuthContext'
import PageTitle from '../components/PageTitle'

const Home = () => {
  const { isLoggedIn, username } = useAuth()
  return (
    <>
    <PageTitle title="Home" />
    <h2>
      {isLoggedIn
        ? `Welcome, ${username}! You're logged in.`
        : 'Hi, please log in (or register) to use the site'}
    </h2>
    </>
  )
}

export default Home