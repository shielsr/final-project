import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { updateAudio, audioApi, getProjects, getTranscription, deleteAudio, getCategories } from '../utils/api'
import Transcriber from '../components/Transcriber'
import { useAuth } from '../AuthContext'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardAction, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import PageTitle from '../components/PageTitle'


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
        <>
            <PageTitle title={audio.title} />
            <audio controls src={audio.url} className='w-full mb-4' />

            <div className='text-sm text-muted-foreground mb-4 space-y-1'>
                {audio.creator_username && <div>Created by: {audio.creator_username}</div>}
                {audio.duration && <div>Length: {formatDuration(audio.duration)}</div>}
                {audio.file_size && <div>Filesize: {formatFileSize(audio.file_size)}</div>}
                {audio.created_at && <div>Recorded: {new Date(audio.created_at).toLocaleString()}</div>}
            </div>

            <Card className="mb-4">
                <CardHeader>
                    <CardTitle>Transcription</CardTitle>
                </CardHeader>
                <CardContent>
                    {transcription
                        ? <p>{transcription.content}</p>
                        : <Transcriber audioUrl={audio.url} audioId={audio.id} onComplete={() => getTranscription(id, setTranscription)} />
                    }
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Edit Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor='audio-title'>Title</Label>
                        <Input
                            id='audio-title'
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor='audio-description'>Description</Label>
                        <Input
                            id='audio-description'
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                    </div>

                    <div>
                        <Label>Category</Label>
                        {['type', 'section'].map(group => (
                            <div key={group} className='mb-3'>
                                <p className='text-sm font-medium capitalize mb-2'>{group}</p>
                                <div className='flex flex-wrap gap-2'>
                                    {categories
                                        .filter(cat => cat.group === group)
                                        .map(cat => (
                                            <Badge
                                                key={cat.id}
                                                onClick={() => toggleCategory(cat.id)}
                                                variant={(audio.categories || []).includes(cat.id) ? 'default' : 'outline'}
                                                className='cursor-pointer'
                                            >
                                                {cat.name}
                                            </Badge>
                                        ))
                                    }
                                </div>
                            </div>
                        ))}
                    </div>


                    <div>
                        <Label htmlFor='audio-project'>Project</Label>
                        <Select
                            value={audio.project?.toString() || 'none'}
                            onValueChange={val => setAudio({ ...audio, project: val === 'none' ? null : val })}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="No project" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='none'>No project</SelectItem>
                                {projectList.map(project => (
                                    <SelectItem key={project.id} value={project.id.toString()}>
                                        {project.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className='flex gap-2 pt-2'>
                        <Button type='submit' onClick={handleSubmit}>Save details</Button>
                        <Button variant='outline' onClick={() => navigate(-1)}>Back</Button>
                    </div>
                    <div className='flex gap-4 pt-2'>
                        {isCreator &&
                            <Button variant='destructive' onClick={() => {
                                deleteAudio(audio, () => { })
                                navigate('/audio')
                            }}>Delete file</Button>
                        }
                    </div>
                </CardContent>
            </Card>
        </>
    )
}

export default AudioDetail