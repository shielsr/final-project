let audioDatastore = { // Simulating a database table
  1: { id: 1, title: 'First recording', description: 'This is the first recording' },
  2: { id: 2, title: 'Second recording', description: 'This is the second recording' },
}
let nextId = 3 // Simulating an autoincrementing database ID field

export const getAudios = (setAudioList) => {
  setAudioList(Object.values(audioDatastore))
}

export const createAudio = (item, setAudioList) => {
  audioDatastore[nextId] = { ...item, id: nextId }
  nextId++
  getAudios(setAudioList) // Refresh
}

export const updateAudio = (item, setAudioList) => {
  audioDatastore[item.id] = item
  getAudios(setAudioList) // Refresh
}

export const deleteAudio = (item, setAudioList) => {
  delete audioDatastore[item.id]
  getAudios(setAudioList) // Refresh
}