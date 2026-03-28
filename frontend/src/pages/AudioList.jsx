import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { getAudios, getCategories } from '../utils/api'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronRight } from 'lucide-react'
import PageTitle from '../components/PageTitle'

const AudioList = () => {
    const { isLoggedIn, isLoading } = useAuth()
    const navigate = useNavigate()
    const [audioList, setAudioList] = useState([])
    const [categories, setCategories] = useState([])
    const [selectedCategories, setSelectedCategories] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!isLoading && !isLoggedIn) navigate('/login')
    }, [isLoggedIn, isLoading, navigate])

    useEffect(() => {
        getAudios((data) => {
            setAudioList(data)
            setLoading(false)
        })
        getCategories(setCategories)
    }, [])

    const toggleCategory = (id) => {
        setSelectedCategories(prev =>
            prev.includes(id)
                ? prev.filter(c => c !== id)
                : [...prev, id]
        )
    }

    const filteredAudio = selectedCategories.length === 0
        ? audioList
        : audioList.filter(audio =>
            selectedCategories.every(catId =>
                (audio.categories || []).includes(catId)
            )
        )

    if (isLoading || !isLoggedIn) return null

    return (
        <>
            <PageTitle title="My files" />

            {categories.length > 0 && (
                <div className="mb-6">
                    <p className="text-sm font-medium mb-2">Filter by category:</p>
                    <div className="flex flex-wrap gap-2">
                        {categories.map(cat => (
                            <Badge
                                key={cat.id}
                                onClick={() => toggleCategory(cat.id)}
                                variant={selectedCategories.includes(cat.id) ? 'default' : 'outline'}
                                className="cursor-pointer"
                            >
                                {cat.name}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}

            {loading
                ? <p className="text-muted-foreground">Getting your files...</p>
                : filteredAudio.length === 0
                    ? <p className="text-muted-foreground">
                        {selectedCategories.length > 0 ? 'No files match the selected filters.' : 'No audio files yet.'}
                      </p>
                    : <div className="grid gap-4">
                        {filteredAudio.map(audio => (
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