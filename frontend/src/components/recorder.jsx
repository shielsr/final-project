import React, { useRef, useState } from 'react'
import { FaCircleStop, FaMicrophone } from 'react-icons/fa6'
import Transcriber from './Transcriber'
import { createAudio } from '../utils/api'


const uploadToCloudinary = async (blob, title) => {
    const formData = new FormData()
    formData.append('file', blob, 'recording.mp3')
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)
    formData.append('resource_type', 'video') // Cloudinary treats audio as 'video'
    formData.append('public_id', title) // Pass the title to Cloudinary as the filename

    const res = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/video/upload`,
        { method: 'POST', body: formData }
    )
    return res.json()
}



export default function Recorder({ setAudioList }) {

    const [isRecording, setIsRecording] = useState(false)
    const [recordedURL, setRecordedURL] = useState('')
    const [recordedBlob, setRecordedBlob] = useState(null)
    const [seconds, setSeconds] = useState(0)
    const [title, setTitle] = useState('')
    const [uploading, setUploading] = useState(false)

    const mediaStream = useRef(null)
    const mediaRecorder = useRef(null)
    const chunks = useRef([])

    const startRecording = async () => {
        setIsRecording(true)
        setRecordedURL('')
        setRecordedBlob(null)
        try {
            setSeconds(0)
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            mediaStream.current = stream
            mediaRecorder.current = new MediaRecorder(stream)
            mediaRecorder.current.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunks.current.push(e.data)
                }
            }
            const timer = setInterval(() => {
                setSeconds(prev => prev + 1)
            }, 1000)

            mediaRecorder.current.onstop = () => {
                const recordedBlob = new Blob(chunks.current, { type: 'audio/mp3' })
                const url = URL.createObjectURL(recordedBlob)
                setRecordedURL(url)
                setRecordedBlob(recordedBlob)
                setFileSize(recordedBlob.size)
                chunks.current = []
                clearTimeout(timer)
            }

            mediaRecorder.current.start()

        } catch (error) {
            console.log(error);
        }

    }

    const stopRecording = () => {
        setIsRecording(false)
        if (mediaRecorder.current) {
            mediaRecorder.current.stop()
            mediaStream.current.getTracks().forEach(track => track.stop())
        }
    }

    // Upload to Cloudinary then save to Django
    const handleSave = async () => {
        if (!recordedBlob || !title) return
        setUploading(true)
        try {
            const data = await uploadToCloudinary(recordedBlob, title)
            await createAudio({
                title,
                description: '',
                url: data.secure_url,       // URL returned by Cloudinary
                duration: Math.round(data.duration ?? seconds), // prefer Cloudinary's duration, fall back to our timer
                file_size: fileSize // This is in bytes
            }, setAudioList)
            // ADDED: reset state after successful save
            setRecordedURL('')
            setRecordedBlob(null)
            setTitle('')
            setSeconds(0)
            setFileSize(null)
        } catch (err) {
            console.error(err)
        } finally {
            setUploading(false)
        }
    }

    const formatTime = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600)
        const minutes = Math.floor((totalSeconds % 3600) / 60)
        const secs = totalSeconds % 60

        return `${String(hours).padStart(2, "0")} : ${String(minutes).padStart(2, "0")} : ${String(secs).padStart(2, "0")}`
    }

    return (
        <div>

            <h2>
                {formatTime(seconds)}
            </h2>

            {isRecording ?
                <button onClick={stopRecording}>
                    <FaCircleStop />
                </button> :


                <button onClick={startRecording}>
                    <FaMicrophone />
                </button>
            }

            {recordedURL && <audio controls src={recordedURL} />}

            {recordedBlob && (
                <div>
                    <input
                        type='text'
                        placeholder='Recording title'
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                    <button onClick={handleSave} disabled={!title || uploading}>
                        {uploading ? 'Saving...' : 'Save Recording'}
                    </button>
                </div>
            )}
            {recordedBlob && <Transcriber audioBlob={recordedBlob} />}
        </div>
    )
}