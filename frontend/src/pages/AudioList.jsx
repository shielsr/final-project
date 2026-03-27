import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { getAudios } from '../utils/api'
import { formatDuration, formatFileSize } from '../utils/formatMetadata'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ChevronRight } from 'lucide-react'
import PageTitle from '../components/PageTitle'

const AudioList = () => {
    const { isLoggedIn } = useAuth()
    const navigate = useNavigate()
    const [audioList, setAudioList] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!isLoggedIn) navigate('/login')
    }, [isLoggedIn, navigate])

    useEffect(() => {
        getAudios((data) => {
            setAudioList(data)
            setLoading(false)
        })
    }, [])

    if (!isLoggedIn) return null

    return (
        <>
            <PageTitle title="My files" />
            {loading
                ? <p className="text-muted-foreground">Getting your files...</p>
                : audioList.length === 0
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