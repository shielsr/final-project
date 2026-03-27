import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import PageTitle from '../components/PageTitle'
import axios from 'axios'

const profileApi = axios.create({ baseURL: '/api/profiles/' })
profileApi.interceptors.request.use(config => {
    const token = localStorage.getItem('appAuthentication.access_token')
    if (token) config.headers.Authorization = `Bearer ${JSON.parse(token)}`
    return config
})

const Profile = () => {
    const { isLoggedIn, username } = useAuth()
    const navigate = useNavigate()
    const [bio, setBio] = useState('')
    const [website, setWebsite] = useState('')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [profileId, setProfileId] = useState(null)

    useEffect(() => {
        if (!isLoggedIn) navigate('/login')
    }, [isLoggedIn, navigate])

    useEffect(() => {
        profileApi.get('/')
            .then(res => {
                if (res.data.length > 0) {
                    const profile = res.data[0]
                    setBio(profile.bio)
                    setWebsite(profile.website)
                    setProfileId(profile.id)
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            if (profileId) {
                await profileApi.put(`/${profileId}/`, { bio, website })
            } else {
                const res = await profileApi.post('/', { bio, website })
                setProfileId(res.data.id)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setSaving(false)
        }
    }

    if (!isLoggedIn) return null

    return (
        <>
            <PageTitle title="My Profile" />
            {loading
                ? <p className="text-muted-foreground">Loading profile...</p>
                : <Card>
                    <CardHeader>
                        <CardTitle>{username}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea
                                    id="bio"
                                    value={bio}
                                    onChange={e => setBio(e.target.value)}
                                    placeholder="Tell us about yourself..."
                                    rows={4}
                                />
                            </div>
                            <div>
                                <Label htmlFor="website">Website</Label>
                                <Input
                                    id="website"
                                    value={website}
                                    onChange={e => setWebsite(e.target.value)}
                                    placeholder="https://mywebsite.com"
                                />
                            </div>
                            <Button type="submit" loading={saving}>Save Profile</Button>
                        </form>
                    </CardContent>
                </Card>
            }
        </>
    )
}

export default Profile