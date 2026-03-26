import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { getAudios } from '../utils/api'
import { formatDuration, formatFileSize } from '../utils/formatMetadata'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ChevronRight } from 'lucide-react'

const AudioList = () => {
    const { isLoggedIn } = useAuth()
    const navigate = useNavigate()
    const [audioList, setAudioList] = useState([])

    useEffect(() => {
        if (!isLoggedIn) navigate('/login')
    }, [isLoggedIn, navigate])

    useEffect(() => {
        getAudios(setAudioList)
    }, [])

    if (!isLoggedIn) return null

    return (
        <>
            <h1 className="text-3xl font-bold mb-6">Audio Files</h1>
            {audioList.length === 0
                ? <p className="text-muted-foreground">No audio files yet.</p>
                : <div className="grid gap-4">
                    {audioList.map(audio => (


                        <Card
                            key={audio.id}
                            size="lg"
                            className="hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => navigate(`/audio/${audio.id}`)}
                        >
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>{audio.title}</CardTitle>
                                </div>
                                <ChevronRight className="h-10 w-10 text-muted-foreground shrink-0" />
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="text-sm text-muted-foreground flex gap-4">
                                    {audio.duration && <span>Length: {formatDuration(audio.duration)}</span>}
                                    {audio.file_size && <span>Filesize: {formatFileSize(audio.file_size)}</span>}
                                    {audio.created_at && <span>Created: {new Date(audio.created_at).toLocaleDateString()}</span>}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            }
        </>
    )
}

export default AudioList