import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { getProjects, deleteProject } from '../utils/api'
import { Button } from 'reactstrap'

const Projects = () => {
    const { isLoggedIn } = useAuth()
    const navigate = useNavigate()
    const [projectList, setProjectList] = useState([])

    useEffect(() => {
        if (!isLoggedIn) navigate('/login')
    }, [isLoggedIn, navigate])

    useEffect(() => {
        getProjects(setProjectList)
    }, [])

    if (!isLoggedIn) return null

    return (
        <main className="content">
            <div className="container-sm w-50 my-4">
                <div className="d-flex justify-content-between align-items-center my-4">
                    <h1>Projects</h1>
                    <Button color='success' onClick={() => navigate('/projects/new')}>New Project</Button>
                </div>

                <ul className='list-group'>
                    {projectList.map(project => (
                        <li key={project.id} className='list-group-item d-flex justify-content-between align-items-center'>
                            <Link to={`/projects/${project.id}`}>{project.title}</Link>
                            <span>
                                <Button color='danger' size='sm' onClick={() => deleteProject(project, setProjectList)}>Delete</Button>
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </main>
    )
}

export default Projects