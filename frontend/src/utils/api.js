import axios from 'axios'

const api = axios.create({ baseURL: '/api/audiofiles/' })

export const getAudios = (setAudioList) => {
  api.get('/')
    .then(res => setAudioList(res.data))
    .catch(console.error)
}

export const createAudio = async (item, setAudioList) => {
  const res = await api.post('/', item)
  await getAudios(setAudioList)
  console.log('createAudio returning:', res.data) 
  return res.data    // Return the saved audio object so we can get its id
}

export const updateAudio = (item, setAudioList) => {
  api.put(`/${item.id}/`, item)
    .then(() => getAudios(setAudioList))
    .catch(console.error)
}

export const deleteAudio = (item, setAudioList) => {
  api.delete(`/${item.id}/`)
    .then(() => getAudios(setAudioList))
    .catch(console.error)
}