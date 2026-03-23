import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { createProject } from '../utils/api'
import { Button, Form, FormGroup, Label, Input } from 'reactstrap'

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
        <main className="content">
            <div className="container-sm w-50 my-4">
                <h1 className="text-center my-4">New Project</h1>
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label for='project-title'>Title</Label>
                        <Input
                            type='text'
                            id='project-title'
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for='project-description'>Description</Label>
                        <Input
                            type='text'
                            id='project-description'
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                    </FormGroup>
                    <Button color='success' type='submit'>Create Project</Button>
                    <Button color='secondary' className='ms-2' onClick={() => navigate('/projects')}>Cancel</Button>
                </Form>
            </div>
        </main>
    )
}

export default ProjectNew