import { useState, useEffect } from 'react'

import { getAudios, createAudio, updateAudio, deleteAudio } from './utils/api'
import AudioModal from './components/Modal'

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
      <h1 className="text-center text-decoration-underline my-4">My Django + React Audio app</h1>
      <div className="row">
        <div className="col-md-6 col-sm-10 mx-auto p-0">
          <div className="card p-3">
            <button onClick={handleCreate} className="btn btn-primary my-1">
              New Task
            </button>
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
    </main>
  )
}

export default App