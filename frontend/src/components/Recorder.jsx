import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaCircleStop, FaMicrophone } from 'react-icons/fa6'
import { createAudio } from '../utils/api'

const uploadToCloudinary = async (blob, title) => {
    const formData = new FormData()
    formData.append('file', blob, title)
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)
    formData.append('resource_type', 'video')
    formData.append('public_id', title)

    const res = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/video/upload`,
        { method: 'POST', body: formData }
    )
    return res.json()
}

export default function Recorder() {
    const navigate = useNavigate()
    const [isRecording, setIsRecording] = useState(false)
    const [seconds, setSeconds] = useState(0)
    const [uploading, setUploading] = useState(false)

    const mediaStream = useRef(null)
    const mediaRecorder = useRef(null)
    const chunks = useRef([])
    const timerRef = useRef(null)

    const startRecording = async () => {
        setIsRecording(true)
        setSeconds(0)
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            mediaStream.current = stream
            mediaRecorder.current = new MediaRecorder(stream)
            mediaRecorder.current.ondataavailable = (e) => {
                if (e.data.size > 0) chunks.current.push(e.data)
            }
            timerRef.current = setInterval(() => {
                setSeconds(prev => prev + 1)
            }, 1000)

            mediaRecorder.current.onstop = async () => {
                clearInterval(timerRef.current)
                const blob = new Blob(chunks.current, { type: 'audio/mp3' })
                chunks.current = []

                const defaultTitle = `Recording ${new Date().toLocaleString()}`
                setUploading(true)
                try {
                    const data = await uploadToCloudinary(blob, defaultTitle)
                    const audio = await createAudio({
                        title: defaultTitle,
                        description: '',
                        url: data.secure_url,
                        duration: Math.round(data.duration ?? seconds),
                        file_size: blob.size
                    }, () => {})
                    navigate(`/audio/${audio.id}`)
                } catch (err) {
                    console.error('Failed to save recording:', err)
                    setUploading(false)
                }
            }

            mediaRecorder.current.start()
        } catch (error) {
            console.error(error)
        }
    }

    const stopRecording = () => {
        setIsRecording(false)
        if (mediaRecorder.current) {
            mediaRecorder.current.stop()
            mediaStream.current.getTracks().forEach(track => track.stop())
        }
    }

    const formatTime = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600)
        const minutes = Math.floor((totalSeconds % 3600) / 60)
        const secs = totalSeconds % 60
        return `${String(hours).padStart(2, "0")} : ${String(minutes).padStart(2, "0")} : ${String(secs).padStart(2, "0")}`
    }

    return (
        <div className="flex flex-col items-center gap-6">
            <h2 className="text-4xl font-mono tracking-widest">{formatTime(seconds)}</h2>

            {isRecording
                ? <button
                    onClick={stopRecording}
                    className="w-32 h-32 rounded-full bg-gray-700 hover:bg-gray-800 text-white flex items-center justify-center shadow-lg transition-all hover:scale-105"
                >
                    <FaCircleStop className="w-12 h-12" />
                </button>
                : <button
                    onClick={startRecording}
                    disabled={uploading}
                    className="w-32 h-32 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-all hover:scale-105 disabled:opacity-50"
                >
                    <FaMicrophone className="w-12 h-12" />
                </button>
            }

            {uploading && <p className="text-muted-foreground text-sm animate-pulse">Saving...</p>}
        </div>
    )
}