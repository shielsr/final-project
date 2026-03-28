import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { search } from '../utils/api'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import PageTitle from '../components/PageTitle'

const Search = () => {
    const { isLoggedIn, isLoading } = useAuth()
    const navigate = useNavigate()
    const [query, setQuery] = useState('')
    const [results, setResults] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleSearch = async (e) => {
        const value = e.target.value
        setQuery(value)
        if (value.length < 2) {
            setResults(null)
            return
        }
        setLoading(true)
        try {
            const res = await search(value)
            setResults(res.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    if (isLoading || !isLoggedIn) {
        if (!isLoading && !isLoggedIn) navigate('/login')
        return null
    }

    const hasResults = results && (
        results.audio.length > 0 ||
        results.projects.length > 0 ||
        results.transcriptions.length > 0
    )

    return (
        <>
            <PageTitle title="Search" />
            <Input
                placeholder="Search audio, projects, transcriptions..."
                value={query}
                onChange={handleSearch}
                className="mb-6"
                autoFocus
            />

            {loading && <p className="text-muted-foreground">Searching...</p>}

            {results && !hasResults && !loading &&
                <p className="text-muted-foreground">No results found for "{query}"</p>
            }

            {results && results.audio.length > 0 && (
                <Card className="mb-4">
                    <CardHeader>
                        <CardTitle>Audio Files</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {results.audio.map(audio => (
                            <div
                                key={audio.id}
                                className="px-6 py-3 border-b last:border-0 cursor-pointer hover:bg-muted"
                                onClick={() => navigate(`/audio/${audio.id}`)}
                            >
                                {audio.title}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {results && results.projects.length > 0 && (
                <Card className="mb-4">
                    <CardHeader>
                        <CardTitle>Projects</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {results.projects.map(project => (
                            <div
                                key={project.id}
                                className="px-6 py-3 border-b last:border-0 cursor-pointer hover:bg-muted"
                                onClick={() => navigate(`/projects/${project.id}`)}
                            >
                                {project.title}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {results && results.transcriptions.length > 0 && (
                <Card className="mb-4">
                    <CardHeader>
                        <CardTitle>Transcriptions</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {results.transcriptions.map(t => (
                            <div
                                key={t.id}
                                className="px-6 py-3 border-b last:border-0 cursor-pointer hover:bg-muted"
                                onClick={() => navigate(`/audio/${t.id}`)}
                            >
                                <div className="font-medium">{t.title}</div>
                                <div className="text-sm text-muted-foreground">...{t.excerpt}...</div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}
        </>
    )
}

export default Search