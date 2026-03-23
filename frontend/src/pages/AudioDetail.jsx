import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Form, FormGroup, Label, Input } from 'reactstrap'
import { formatDuration, formatFileSize } from '../utils/formatMetadata'
import { updateAudio } from '../utils/api'

const AudioDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [audio, setAudio] = useState(null)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [error, setError] = useState(false)

    useEffect(() => {
        fetch(`/api/audiofiles/${id}/`)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error: ${res.status}`)
                return res.json()
            })
            .then(data => {
                setAudio(data)
                setTitle(data.title)
                setDescription(data.description)
            })
            .catch(err => {
                console.error('Failed to get audio:', err)
                setError(true)
            })
    }, [id])

    const handleSubmit = (e) => {
        e.preventDefault()
        updateAudio({ ...audio, title, description }, () => { })
        navigate('/record')
    }

    if (error) return <p>Unable to load audio</p>
    if (!audio) return <p>Loading...</p>

    return (
        <main className="content">
            <div className="container-sm w-50 my-4">
                <h1 className="text-center my-4">{audio.title}</h1>

                <div className='text-muted small mb-3'>
                    {audio.duration && <div>⏱ Duration: {formatDuration(audio.duration)}</div>}
                    {audio.file_size && <div>💾 File size: {formatFileSize(audio.file_size)}</div>}
                    {audio.created_at && <div>🗓 Recorded: {new Date(audio.created_at).toLocaleString()}</div>}
                </div>
                <div className='text'>Hello</div>

                <audio controls src={audio.url} className='w-100 my-3' />

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
                    <Button color='success' type='submit'>Save</Button>
                    <Button color='secondary' className='ms-2' onClick={() => navigate('/record')}>Back</Button>
                </Form>
            </div>
        </main>
    )
}

export default AudioDetail