import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { audioApi, projectApi, updateProject, getUsers, addCowriter, removeCowriter, deleteProject } from '../utils/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronRight } from 'lucide-react'
import PageTitle from '../components/PageTitle'

const ProjectDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { isLoggedIn, isLoading, username } = useAuth()
    const [project, setProject] = useState(null)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [audios, setAudios] = useState([])
    const [error, setError] = useState(false)
    const [cowriters, setCowriters] = useState([])
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState('')

    useEffect(() => {
        if (!isLoading && !isLoggedIn) navigate('/login')
    }, [isLoggedIn, isLoading, navigate])

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

    useEffect(() => {
        getUsers().then(res => setUsers(res.data))
    }, [])

    useEffect(() => {
        projectApi.get(`/${id}/cowriters/`)
            .then(res => setCowriters(res.data))
            .catch(console.error)
    }, [id])

    const handleSubmit = (e) => {
        e.preventDefault()
        updateProject({ id: project.id, title, description }, () => { })
    }

    if (error) return <p>Unable to load project</p>
    if (!project) return <p>Loading...</p>

    const isOwner = project.owner_username === username

    return (
        <>
            <PageTitle title={project.title} />
            <div className="text-sm text-muted-foreground mb-4 space-y-1">
                <div>Owner: {project.owner_username}</div>
            </div>

            <Card className="mb-4">
                <CardHeader>
                    <CardTitle>Edit Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                    <div className="flex gap-4 pt-2">
                        <Button onClick={handleSubmit}>Save</Button>
                        <Button variant='outline' onClick={() => navigate(-1)}>Back</Button>
                        {isOwner &&
                            <Button variant='destructive' onClick={() => {
                                deleteProject(project, () => { })
                                navigate('/projects')
                            }}>Delete Project</Button>
                        }
                    </div>
                </CardContent>
            </Card>

            <Card className="mb-4">
                <CardHeader>
                    <CardTitle>Audio Files</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {audios.length === 0
                        ? <p className="text-muted-foreground p-6">No audio files in this project.</p>
                        : <div className="grid gap-4 p-4">
                            {audios.map(audio => (
                                <Card
                                    key={audio.id}
                                    className="hover:shadow-md transition-shadow cursor-pointer"
                                    onClick={() => navigate(`/audio/${audio.id}`)}
                                >
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle>{audio.title}</CardTitle>
                                        <ChevronRight className="h-10 w-10 text-muted-foreground shrink-0" />
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <div className="text-sm text-muted-foreground flex gap-4">
                                            {audio.duration && <span>Length: {formatDuration(audio.duration)}</span>}
                                            {audio.file_size && <span>Filesize: {formatFileSize(audio.file_size)}</span>}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    }
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Writers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <ul className="divide-y border rounded-md">
                        <li className="px-4 py-3 text-sm font-medium">
                            {project.owner_username} <span className="text-muted-foreground">(owner)</span>
                        </li>
                        {cowriters.map(cw => (
                            <li key={cw.id} className="px-4 py-3 flex justify-between items-center">
                                <span className="text-sm font-medium">{cw.username}</span>
                                <Button
                                    variant='destructive'
                                    size='sm'
                                    onClick={() =>
                                        removeCowriter(id, cw.id)
                                            .then(() => setCowriters(cowriters.filter(c => c.id !== cw.id)))
                                    }
                                >Remove</Button>
                            </li>
                        ))}
                    </ul>

                    <div className="flex gap-2">
                        <Select
                            value={selectedUser || 'none'}
                            onValueChange={val => setSelectedUser(val === 'none' ? '' : val)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a user..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='none'>Select a user...</SelectItem>
                                {users
                                    .filter(u => !cowriters.find(cw => cw.id === u.id))
                                    .map(u => (
                                        <SelectItem key={u.id} value={u.id.toString()}>
                                            {u.username}
                                        </SelectItem>
                                    ))
                                }
                            </SelectContent>
                        </Select>
                        <Button
                            disabled={!selectedUser || selectedUser === 'none'}
                            onClick={() =>
                                addCowriter(id, selectedUser)
                                    .then(() => {
                                        const user = users.find(u => u.id === parseInt(selectedUser))
                                        setCowriters([...cowriters, user])
                                        setSelectedUser('')
                                    })
                            }
                        >Add</Button>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}

export default ProjectDetail