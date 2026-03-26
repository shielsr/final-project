import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import Recorder from '../components/Recorder'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'


const Record = () => {
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoggedIn) navigate('/login')
  }, [isLoggedIn, navigate])

  if (!isLoggedIn) return null

  return (
    <>   
          <div className="card-body text-center">
            <h5 className="card-title">Record audio</h5>
            <Recorder />
          </div>
    </> 
  )
}

export default Record