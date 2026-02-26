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

    return (
        <div>

            <h2>
               00:00:00 
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