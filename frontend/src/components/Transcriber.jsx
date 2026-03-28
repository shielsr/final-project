import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function Transcriber({ audioUrl, audioId, onComplete }) {
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
            console.log('Status:', res.status)
            const text = await res.text()
            console.log('Response:', text)
            const data = JSON.parse(text)
            if (data.error) throw new Error(data.error)
            setTranscription(data.transcription)
            if (onComplete) onComplete()
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <Button onClick={run} disabled={!audioUrl} loading={loading}>
                Transcribe
            </Button>
            {error && <p className="text-sm text-destructive mt-2">{error}</p>}
            {transcription && <p className="mt-2">{transcription}</p>}
        </div>
    )
}