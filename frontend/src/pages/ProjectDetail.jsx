import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { audioApi, projectApi, updateProject } from '../utils/api'
import { Button, Form, FormGroup, Label, Input } from 'reactstrap'
import { formatDuration, formatFileSize } from '../utils/formatMetadata'

const ProjectDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { isLoggedIn } = useAuth()
    const [project, setProject] = useState(null)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [audios, setAudios] = useState([])
    const [error, setError] = useState(false)

    useEffect(() => {
        if (!isLoggedIn) navigate('/login')
    }, [isLoggedIn, navigate])

    useEffect(() => {
        projectApi.get(`/${id}/`)
            .then(res => {
                setProject(res.data)
                setTitle(res.data.title)
                setDescription(res.data.description)
            })
            .catch(() => setError(true))
    }, [id])

    useEffect(() => {
        audioApi.get(`/?project=${id}`)
            .then(res => setAudios(res.data))
            .catch(console.error)
    }, [id])

    const handleSubmit = (e) => {
        e.preventDefault()
        updateProject({ id: project.id, title, description }, () => {})
    }

    if (error) return <p>Unable to load project</p>
    if (!project) return <p>Loading...</p>

    return (
        <main className="content">
            <div className="container-sm w-50 my-4">
                <h1 className="text-center my-4">{project.title}</h1>

                <Form onSubmit={handleSubmit} className="mb-4">
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
                    <Button color='success' type='submit'>Save</Button>
                    <Button color='secondary' className='ms-2' onClick={() => navigate('/projects')}>Back</Button>
                </Form>

                <h3>Audio Files</h3>
                <ul className='list-group mb-4'>
                    {audios.length === 0
                        ? <li className='list-group-item'>No audio files in this project.</li>
                        : audios.map(audio => (
                            <li key={audio.id} className='list-group-item d-flex justify-content-between align-items-center'>
                                <Link to={`/audio/${audio.id}`}>{audio.title}</Link>
                                <span className='text-muted small'>
                                    {audio.duration && <span className='me-2'>⏱ {formatDuration(audio.duration)}</span>}
                                    {audio.file_size && <span>💾 {formatFileSize(audio.file_size)}</span>}
                                </span>
                            </li>
                        ))
                    }
                </ul>

                <h3>Cowriters</h3>
                <p className='text-muted'>Coming soon.</p>
            </div>
        </main>
    )
}

export default ProjectDetail