import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import Recorder from '../components/Recorder'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import PageTitle from '../components/PageTitle'

const Record = () => {
  const { isLoggedIn, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && !isLoggedIn) navigate('/login')
  }, [isLoggedIn, isLoading, navigate])

  if (isLoading || !isLoggedIn) return null

  return (
    <>
      <PageTitle title="Record audio" />
      <div className="max-w-md mx-auto mt-16">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Press the buton to start and stop recording</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Recorder />
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default Record