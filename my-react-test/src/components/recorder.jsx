import React, { useState } from 'react'
import { FaCircleStop, FaMicrophone } from 'react-icons/fa6'

export default function Recorder() {

    const [isRecording, setIsRecording] = useState(false)
    const [seconds, setSeconds] = useState(0)
    const startRecording = async() => {
        setIsRecording(true)
        const time = setInterval(() => {
            setSeconds(prev => prev +1)
        }, 1000)
    }

    const stopRecording = () => {
        setIsRecording(false)
    }

    const formatTime = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600)
        const minutes = Math.floor((totalSeconds % 3600)/60)
        const secs = totalSeconds % 60

        return `${String(hours).padStart(2, "0")} : ${String(minutes).padStart(2,"0")} : ${String(secs).padStart(2,"0")}`
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
        </div>
    )
}