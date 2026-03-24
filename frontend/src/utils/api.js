import axios from 'axios'

export const audioApi = axios.create({ baseURL: '/api/audiofiles/' })
export const projectApi = axios.create({ baseURL: '/api/projects/' })
const transcriptionApi = axios.create({ baseURL: '/api/transcriptions/' })
const categoryApi = axios.create({ baseURL: '/api/categories/' })

// Interceptor for adding the authorization token
const attachToken = config => {
  const token = localStorage.getItem('appAuthentication.access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${JSON.parse(token)}`
  }
  return config
}

// Attaching user to an audio file
audioApi.interceptors.request.use(attachToken)
// Attaching user to a project
projectApi.interceptors.request.use(attachToken)
// Attaching user to a transcription
transcriptionApi.interceptors.request.use(attachToken)
// Attaching the categories
categoryApi.interceptors.request.use(attachToken)



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
  return audioApi.put(`/${item.id}/`, {
    title: item.title,
    description: item.description,
    project: item.project ? parseInt(item.project) : null,
    categories: item.categories || []
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


// Adding and removing cowriters

export const addCowriter = (projectId, userId) => {
  return projectApi.post(`/${projectId}/add_cowriter/`, { user_id: userId })
}

export const removeCowriter = (projectId, userId) => {
  return projectApi.post(`/${projectId}/remove_cowriter/`, { user_id: userId })
}

export const getUsers = () => {
  return axios.get('/api/auth/users/', {
    headers: {
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('appAuthentication.access_token'))}`
    }
  })
}


// Categories

export const getCategories = (setCategories) => {  // NEW
  categoryApi.get('/')
    .then(res => setCategories(res.data))
    .catch(console.error)
}