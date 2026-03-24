import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import Recorder from '../components/Recorder'

const Record = () => {
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoggedIn) navigate('/login')
  }, [isLoggedIn, navigate])

  if (!isLoggedIn) return null

  return (
    <main className="content">
      <div className="container-sm w-50">
        <div className="card my-4">
          <div className="card-body text-center">
            <h5 className="card-title">Record audio</h5>
            <Recorder />
          </div>
        </div>
      </div>
    </main>
  )
}

export default Record