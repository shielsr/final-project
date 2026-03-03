import React, { useMemo, useState } from 'react'
import { AssemblyAI } from 'assemblyai'

const BASE_URL = 'https://api.eu.assemblyai.com'

export default function Transcriber({ audioBlob }) {

    const [transcript, setTranscript] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const client = useMemo(() => new AssemblyAI({
        apiKey: import.meta.env.VITE_ASSEMBLYAI_API_KEY,
        baseUrl: BASE_URL
    }), [])

    const run = async () => {
        setLoading(true)
        setError('')
        try {
            const result = await client.transcripts.transcribe({
                audio: audioBlob,
                speech_models: ["universal-3-pro", "universal-2"],
                language_detection: true,
                speaker_labels: true,
            })

            if (result.status === 'error') throw new Error(result.error)

            setTranscript(result.text)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <button onClick={run} disabled={!audioBlob || loading}>
                {loading ? 'Transcribing...' : 'Transcribe'}
            </button>
            {error && <p>{error}</p>}
            {transcript && <p>{transcript}</p>}
        </div>
    )
}