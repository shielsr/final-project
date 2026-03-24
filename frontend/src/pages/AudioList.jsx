import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { getAudios } from '../utils/api'
import { formatDuration, formatFileSize } from '../utils/formatMetadata'

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
        <main className="content">
            <div className="container-sm w-50 my-4">
                <h1 className="text-center my-4">Audio Files</h1>
                <ul className='list-group'>
                    {audioList.map(audio => (
                        <li key={audio.id} className='list-group-item'>
                            <Link to={`/audio/${audio.id}`}>{audio.title}</Link>
                            <div className='text-muted small mt-1'>
                                {audio.duration && <span className='me-3'>⏱ {formatDuration(audio.duration)}</span>}
                                {audio.file_size && <span className='me-3'>💾 {formatFileSize(audio.file_size)}</span>}
                                {audio.created_at && <span>🗓 {new Date(audio.created_at).toLocaleDateString()}</span>}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </main>
    )
}

export default AudioList