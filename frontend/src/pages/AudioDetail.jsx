import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Form, FormGroup, Label, Input } from 'reactstrap'
import { formatDuration, formatFileSize } from '../utils/formatMetadata'
import { updateAudio, audioApi, getProjects, getTranscription, deleteAudio, getCategories } from '../utils/api'
import Transcriber from '../components/Transcriber'
import { useAuth } from '../AuthContext'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardAction, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'


const AudioDetail = () => {
    const { username } = useAuth()
    const { id } = useParams()
    const navigate = useNavigate()
    const [audio, setAudio] = useState(null)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [error, setError] = useState(false)
    const [projectList, setProjectList] = useState([])
    const [transcription, setTranscription] = useState(null)
    const [categories, setCategories] = useState([])

    useEffect(() => {
        audioApi.get(`/${id}/`)
            .then(res => {
                const data = res.data
                console.log(data)
                setAudio(data)
                setTitle(data.title)
                setDescription(data.description)
            })
            .catch(err => {
                console.error('Failed to get audio:', err)
                setError(true)
            })
    }, [id])

    useEffect(() => {
        getProjects(setProjectList)
    }, [])

    useEffect(() => {
        getTranscription(id, setTranscription)
    }, [id])

    useEffect(() => {
        getCategories(setCategories)
    }, [])

    // Toggle a category on or off
    const toggleCategory = (categoryId) => {
        const current = audio.categories || []
        const updated = current.includes(categoryId)
            ? current.filter(id => id !== categoryId)
            : [...current, categoryId]
        setAudio({ ...audio, categories: updated })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        await updateAudio({ id: audio.id, title, description, project: audio.project, categories: audio.categories || [] }, () => { })
        navigate('/audio')
    }

    if (error) return <p>Unable to load audio</p>
    if (!audio) return <p>Loading...</p>

    const isCreator = audio.creator_username === username

    return (
        <main className="content">
            <div className="container-sm w-50 my-4">
                <h1 className="text-center my-4">{audio.title}</h1>
                <audio controls src={audio.url} className='w-100 my-3' />
                <div className='text-muted small mb-3'>
                    {audio.creator_username && <div>👤 Created by: {audio.creator_username}</div>}
                    {audio.duration && <div>⏱ Duration: {formatDuration(audio.duration)}</div>}
                    {audio.file_size && <div>💾 File size: {formatFileSize(audio.file_size)}</div>}
                    {audio.created_at && <div>🗓 Recorded: {new Date(audio.created_at).toLocaleString()}</div>}
                </div>



                <div className='transcription'>
                    <h3>Transcription:</h3>
                    {transcription
                        ? <p>{transcription.content}</p>
                        : <Transcriber audioUrl={audio.url} audioId={audio.id} onComplete={() => getTranscription(id, setTranscription)} />
                    }
                </div>


                <div className='card text-start'>
                    <div className='card-body'>
                        <h3 className='card-title'>Edit details</h3>
                        <Form onSubmit={handleSubmit}>
                            <FormGroup>
                                <Label for='audio-title'>Title</Label>
                                <Input
                                    type='text'
                                    id='audio-title'
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for='audio-description'>Description</Label>
                                <Input
                                    type='text'
                                    id='audio-description'
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                />
                            </FormGroup>
                            <FormGroup>
                                <h4>Category</h4>
                                {['type', 'section'].map(group => (
                                    <div key={group} className='mb-3'>
                                        <h5 className='text-capitalize'>{group}</h5>
                                        <div className='d-flex flex-wrap gap-2'>
                                            {categories
                                                .filter(cat => cat.group === group)
                                                .map(cat => (
                                                    <span
                                                        key={cat.id}
                                                        onClick={() => toggleCategory(cat.id)}
                                                        style={{ cursor: 'pointer' }}
                                                        className={`badge ${(audio.categories || []).includes(cat.id) ? 'bg-primary' : 'bg-secondary'}`}
                                                    >
                                                        {cat.name}
                                                    </span>
                                                ))
                                            }
                                        </div>
                                    </div>
                                ))}
                            </FormGroup>
                            <FormGroup>
                                <Label for='audio-project'>Project</Label>
                                <Input
                                    type='select'
                                    id='audio-project'
                                    value={audio.project || ''}
                                    onChange={e => setAudio({ ...audio, project: e.target.value || null })}
                                >
                                    <option value=''>No project</option>
                                    {projectList.map(project => (
                                        <option key={project.id} value={project.id}>{project.title}</option>
                                    ))}
                                </Input>
                            </FormGroup>
                            <Button color='success' type='submit'>Save</Button>
                            <Button color='secondary' className='ms-2' onClick={() => navigate('/record')}>Back</Button>
                            {isCreator &&
                                <Button color='danger' className='ms-2' onClick={() => {
                                    deleteAudio(audio, () => { })
                                    navigate('/audio')
                                }}>Delete</Button>
                            }
                        </Form>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default AudioDetail