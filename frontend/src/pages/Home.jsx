import { useAuth } from '../AuthContext'
import { useNavigate } from 'react-router-dom'
import PageTitle from '../components/PageTitle'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const Home = () => {
  const { isLoggedIn, username } = useAuth()
  const navigate = useNavigate()

  return (
    <>
      <PageTitle title="Welcome" />
      <p className="mb-6">
        {isLoggedIn
          ? `Welcome, ${username}! You're logged in.`
          : 'Hi, please log in (or register) to use the site'}
      </p>

      {!isLoggedIn && (
        <div className="flex gap-2 mb-6">
          <Button onClick={() => navigate('/login')}>Login</Button>
          <Button variant="outline" onClick={() => navigate('/register')}>Register</Button>
        </div>
      )}

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>What is Overnote?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Overnote is an app for songwriters and any creative people.</p>
          <p>Inspiration can strike at any time, any place.</p>
          <p>Use Overnote to capture and keep track of your ideas.</p>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>What can I do with Overnote?</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 list-disc list-inside">
            <li>Record audio</li>
            <li>Give it a name and description</li>
            <li>Transcribe it with AI</li>
            <li>Tag it with multiple category tags</li>
            <li>Add it to projects</li>
            <li>Add other writers to your projects</li>
          </ul>
        </CardContent>
      </Card>
    </>
  )
}

export default Home