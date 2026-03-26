import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { createProject } from '../utils/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const ProjectNew = () => {
    const { isLoggedIn } = useAuth()
    const navigate = useNavigate()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')

    useEffect(() => {
        if (!isLoggedIn) navigate('/login')
    }, [isLoggedIn, navigate])

    const handleSubmit = async (e) => {
        e.preventDefault()
        await createProject({ title, description }, () => {})
        navigate('/projects')
    }

    if (!isLoggedIn) return null

    return (
        <>
            <h1 className="text-3xl font-bold mb-6">New Project</h1>
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
                <div className="flex gap-2">
                    <Button type='submit'>Create Project</Button>
                    <Button variant='secondary' onClick={() => navigate('/projects')}>Cancel</Button>
                </div>
            </form>
        </>
    )
}

export default ProjectNew