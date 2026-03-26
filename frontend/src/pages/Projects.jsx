import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { getProjects, deleteProject } from '../utils/api'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardAction, CardDescription } from '@/components/ui/card'



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
            <>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Projects</h1>
                    <Button onClick={() => navigate('/projects/new')}>New Project</Button>
                </div>

                <Card>
                    <CardContent className="p-0">
                        {projectList.length === 0
                            ? <p className="text-muted-foreground p-6">No projects yet.</p>
                            : projectList.map(project => (
                                <div
                                    key={project.id}
                                    className="flex justify-between items-center px-6 py-4 border-b last:border-0"
                                >
                                    <Link
                                        to={`/projects/${project.id}`}
                                        className="font-medium hover:underline"
                                    >
                                        {project.title}
                                    </Link>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => deleteProject(project, setProjectList)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            ))
                        }
                    </CardContent>
                </Card>
            </>
        
    )
}

export default Projects