import React from 'react'
import { FaCircleStop, FaMicrophone } from 'react-icons/fa6'

export default function Recorder() {
    return (
        <div>

            <h2>
               00:00:00 
            </h2>

            <button>
                <FaCircleStop />
            </button>

            <button>
                <FaMicrophone />
            </button>
        </div>
    )
}