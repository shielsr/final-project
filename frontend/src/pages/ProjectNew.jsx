import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { createProject } from '../utils/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import PageTitle from '../components/PageTitle'

const ProjectNew = () => {
    const { isLoggedIn, isLoading } = useAuth()
    const navigate = useNavigate()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')

    useEffect(() => {
        if (!isLoading && !isLoggedIn) navigate('/login')
    }, [isLoggedIn, isLoading, navigate])

    const handleSubmit = async (e) => {
        e.preventDefault()
        await createProject({ title, description }, () => { })
        navigate('/projects')
    }

    if (isLoading || !isLoggedIn) return null

    return (
        <>
            <PageTitle title="New project" />
            <Card>
                <CardHeader>
                    <CardTitle>Project Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor='project-title'>Title</Label>
                            <Input
                                id='project-title'
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor='project-description'>Description</Label>
                            <Input
                                id='project-description'
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <Button type='submit'>Create Project</Button>
                            <Button variant='outline' type='button' onClick={() => navigate(-1)}>Cancel</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </>
    )
}

export default ProjectNew