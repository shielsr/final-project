import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { getAudios, createAudio, updateAudio, deleteAudio } from '../utils/api'
import Recorder from '../components/Recorder'
import { formatDuration, formatFileSize } from '../utils/formatMetadata'
import { Link } from 'react-router-dom'

const AudioItem = ({ item, onEdit, onDelete }) => (
  <li className='list-group-item d-flex justify-content-between align-items-center'>
    <Link to={`/audio/${item.id}`}>{item.title}</Link>
    <div className='text-muted small mt-1'>
      {item.duration && <span className='me-3'>⏱ {formatDuration(item.duration)}</span>}
      {item.file_size && <span className='me-3'>💾 {formatFileSize(item.file_size)}</span>}
      {item.created_at && <span>🗓 {new Date(item.created_at).toLocaleDateString()}</span>}
    </div>
    <span>
      <button onClick={() => onEdit(item)} className='btn btn-secondary mx-1'>Edit</button>
      <button onClick={() => onDelete(item)} className='btn btn-danger mx-1'>Delete</button>
    </span>
  </li>
)

const AudioList = ({ items, onEdit, onDelete }) => (
  <ul className='list-group list-group-flush'>
    {items.map(item => (
      <AudioItem
        key={item.id}
        item={item}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    ))}
  </ul>
)

const Record = () => {
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()

  const [audioList, setAudioList] = useState([])
  const [activeItem, setActiveItem] = useState({ title: '', description: '' })

  useEffect(() => {
    if (!isLoggedIn) navigate('/login')
  }, [isLoggedIn, navigate])

  useEffect(() => { getAudios(setAudioList) }, [])

  const handleEdit = (item) => {
    setActiveItem(item)
  }

  const handleSubmit = (item) => {
    if (item.id) {
      updateAudio(item, setAudioList)
    } else {
      createAudio(item, setAudioList)
    }
  }

  const handleDelete = (item) => {
    deleteAudio(item, setAudioList)
  }


  if (!isLoggedIn) return null

  return (
    <main className="content">
      <div className="container-sm w-50">
        

        <div className="card my-4">
          <div className="card-body text-center">
            <h5 className="card-title">Record audio</h5>
            <Recorder setAudioList={setAudioList} />
          </div>
        </div>

        <div className="row">
          <div className="col-md-10 col-sm-10 mx-auto p-0">
            <div className="card p-3">
              <AudioList
                items={audioList}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          </div>
        </div>

        
      </div>
    </main>
  )
}

export default Record