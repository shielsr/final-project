import { useState } from 'react'
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input } from 'reactstrap'
import { formatDuration, formatFileSize } from '../utils/formatMetadata'

const RequiredTextField = ({ name, value, setValue }) => (
  <FormGroup>
    <Label for={`audio-${name}`} className='text-capitalize'>{name}</Label>
    <Input
      type='text'
      id={`audio-${name}`}
      name={name}
      value={value}
      onChange={e => setValue(e.target.value)}
      placeholder={`Enter Audio ${name}`}
      required
    />
  </FormGroup>
)

const CheckboxField = ({ name, value, setValue }) => (
  <FormGroup check>
    <Label check>
      <Input
        type='checkbox'
        name={name}
        checked={value}
        onChange={e => setValue(e.target.checked)}
      />
      {name}
    </Label>
  </FormGroup>
)

const AudioModal = ({ activeItem, toggle, onSave }) => {
  const [title, setTitle] = useState(activeItem.title)
  const [description, setDescription] = useState(activeItem.description)
  
  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({ id: activeItem.id, title, description })
  }

  return (
    <Modal isOpen toggle={toggle}>
      <ModalHeader toggle={toggle}>Audio Item</ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <RequiredTextField name='title' value={title} setValue={setTitle} />
          <RequiredTextField name='description' value={description} setValue={setDescription} />
           <div className='text-muted small mb-3'>
            {activeItem.duration && <div>⏱ Duration: {formatDuration(activeItem.duration)}</div>}
            {activeItem.file_size && <div>💾 File size: {formatFileSize(activeItem.file_size)}</div>}
            {activeItem.created_at && <div>🗓 Recorded: {new Date(activeItem.created_at).toLocaleString()}</div>}
          </div>
          <Button color='success' type='submit'>Save</Button>
        </Form>
      </ModalBody>
    </Modal>
  )
}

export default AudioModal