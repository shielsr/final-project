import { useState } from 'react'

export default function Transcriber({ audioUrl, audioId }) {
    // console.log('Transcriber props:', { audioUrl, audioId })
    const [transcription, setTranscription] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const run = async () => {
        setLoading(true)
        setError('')
        try {
            const res = await fetch('/api/transcribe/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: audioUrl, audio_id: audioId })
            })
            const data = await res.json()
            if (data.error) throw new Error(data.error)
            setTranscription(data.transcription)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <button onClick={run} disabled={!audioUrl || loading}>
                {loading ? 'Transcribing...' : 'Transcribe'}
            </button>
            {error && <p>{error}</p>}
            {transcription && <p>{transcription}</p>}
        </div>
    )
}