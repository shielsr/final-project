import { useEffect } from 'react'

const PageTitle = ({ title }) => {
    useEffect(() => {
        document.title = `${title} | Overnote`
        return () => { document.title = 'Overnote' }
    }, [title])

    return <h1 className="text-3xl font-bold pb-4">{title}</h1>
}

export default PageTitle