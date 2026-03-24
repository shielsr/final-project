import axios from 'axios'

export const audioApi = axios.create({ baseURL: '/api/audiofiles/' })
export const projectApi = axios.create({ baseURL: '/api/projects/' })
const transcriptionApi = axios.create({ baseURL: '/api/transcriptions/' })

// Interceptor for adding the authorization token
const attachToken = config => {
  const token = localStorage.getItem('appAuthentication.access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${JSON.parse(token)}`
  }
  return config
}

// For attaching user to an audio file
audioApi.interceptors.request.use(attachToken)
// For attaching user to a project
projectApi.interceptors.request.use(attachToken)
// For attaching user to a transcription
transcriptionApi.interceptors.request.use(attachToken)



export const getTranscription = (audioId, setTranscription) => {
  transcriptionApi.get(`/?audio=${audioId}`)
    .then(res => setTranscription(res.data[0] || null))  // [0] because it returns a list
    .catch(console.error)
}



// CRUD operations for the audio files

export const getAudios = (setAudioList) => {
  audioApi.get('/')
    .then(res => setAudioList(res.data))
    .catch(console.error)
}

export const createAudio = async (item, setAudioList) => {
  const res = await audioApi.post('/', item)
  await getAudios(setAudioList)
  console.log('createAudio returning:', res.data)
  return res.data    // Return the saved audio object to get its ID
}

export const updateAudio = (item, setAudioList) => {
  audioApi.put(`/${item.id}/`, {
    title: item.title,
    description: item.description,
    project: item.project ? parseInt(item.project) : null
  })
    .then(() => getAudios(setAudioList))
    .catch(console.error)
}

export const deleteAudio = (item, setAudioList) => {
  audioApi.delete(`/${item.id}/`)
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