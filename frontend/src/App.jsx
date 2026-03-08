import { useState, useEffect } from 'react'

import { getAudios, createAudio, updateAudio, deleteAudio } from './utils/api'
import AudioModal from './components/Modal'
import Recorder from "./components/Recorder"
import { formatDuration, formatFileSize } from './utils/formatMetadata'

const AudioItem = ({ item, onEdit, onDelete }) => (
  <li className='list-group-item d-flex justify-content-between align-items-center'>
    <button
      type='button'
      onClick={() => onEdit(item)}
      className='audio-title me-2 btn btn-link text-start p-0'
      title={item.description}
    >
      {item.title}
    </button>
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

const App = () => {
  const [audioList, setAudioList] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [activeItem, setActiveItem] = useState({
    title: '',
    description: '',
  })

  useEffect(() => { getAudios(setAudioList) }, [])

  const handleCreate = () => {
    setActiveItem({ title: '', description: '' })
    setShowModal(true)
  }

  const handleEdit = (item) => {
    setActiveItem(item)
    setShowModal(true)
  }

  const handleSubmit = (item) => {
    if (item.id) {
      updateAudio(item, setAudioList)
    } else {
      createAudio(item, setAudioList)
    }
    setShowModal(false)
  }

  const handleDelete = (item) => {
    deleteAudio(item, setAudioList)
  }

  const toggleModal = () => setShowModal(!showModal)

  return (
    <main className="content">
      <div className="container-sm w-50">
        <h1 className="text-center my-4">Overnote</h1>
        <h2 className="text-center my-4">The notetaking app for songwriters</h2>

        <div className="card my-4">
          <div className="card-body text-center">
            <h5 className="card-title">Record audio</h5>
            <Recorder setAudioList={setAudioList} />
          </div>
        </div>

        <div className="row">
          <div className="col-md-10 col-sm-10 mx-auto p-0">
            <div className="card p-3">
              {/* <button onClick={handleCreate} className="btn btn-primary my-1">
                New Task
              </button> */}
              <AudioList
                items={audioList}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          </div>
        </div>
        {showModal && (
          <AudioModal
            activeItem={activeItem}
            toggle={toggleModal}
            onSave={handleSubmit}
          />
        )}


      </div>
    </main>
  )
}

export default App