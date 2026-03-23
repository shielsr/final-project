import axios from 'axios'

export const api = axios.create({ baseURL: '/api/audiofiles/' })

api.interceptors.request.use(config => {
  const token = localStorage.getItem('appAuthentication.access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${JSON.parse(token)}`
  }
  return config
})

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