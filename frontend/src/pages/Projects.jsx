import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { getProjects } from '../utils/api'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronRight } from 'lucide-react'
import PageTitle from '../components/PageTitle'

const Projects = () => {
    const { isLoggedIn, isLoading } = useAuth()
    const navigate = useNavigate()
    const [projectList, setProjectList] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!isLoading && !isLoggedIn) navigate('/login')
    }, [isLoggedIn, isLoading, navigate])

    useEffect(() => {
        getProjects((data) => {
            setProjectList(data)
            setLoading(false)
        })
    }, [])

    if (isLoading || !isLoggedIn) return null

    return (
        <>
            <div className="flex justify-between">
                <PageTitle title="Projects" />
                <Button onClick={() => navigate('/projects/new')}>Create new project</Button>
            </div>

            {loading
                ? <p className="text-muted-foreground">Getting your projects...</p>
                : projectList.length === 0
                    ? <p className="text-muted-foreground">No projects yet.</p>
                    : <div className="grid gap-4">
                        {projectList.map(project => (
                            <Card
                                key={project.id}
                                className="hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => navigate(`/projects/${project.id}`)}
                            >
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle>{project.title}</CardTitle>
                                    <ChevronRight className="h-10 w-10 text-muted-foreground shrink-0" />
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
            }
        </>
    )
}

export default Projects