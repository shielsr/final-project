import axios from 'axios'

export const api = axios.create({ baseURL: '/api/audiofiles/' })
const projectApi = axios.create({ baseURL: '/api/projects/' })  

// Interceptor for adding the authorization token
const attachToken = config => {
  const token = localStorage.getItem('appAuthentication.access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${JSON.parse(token)}`
  }
  return config
}

// For attaching user to a new audio file
api.interceptors.request.use(attachToken)
// For attaching user to a new project
projectApi.interceptors.request.use(attachToken)  


// CRUD operations for the audio files

export const getAudios = (setAudioList) => {
  api.get('/')
    .then(res => setAudioList(res.data))
    .catch(console.error)
}

export const createAudio = async (item, setAudioList) => {
  const res = await api.post('/', item)
  await getAudios(setAudioList)
  console.log('createAudio returning:', res.data) 
  return res.data    // Return the saved audio object to get its ID
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

// CRUD operations for the projects

export const getProjects = (setProjectList) => {
  projectApi.get('/')
    .then(res => setProjectList(res.data))
    .catch(console.error)
}

export const createProject = async (item, setProjectList) => {
  await projectApi.post('/', item)
  await getProjects(setProjectList)
}

export const updateProject = (item, setProjectList) => {
  projectApi.put(`/${item.id}/`, item)
    .then(() => getProjects(setProjectList))
    .catch(console.error)
}

export const deleteProject = (item, setProjectList) => {
  projectApi.delete(`/${item.id}/`)
    .then(() => getProjects(setProjectList))
    .catch(console.error)
}