import Navbar from '@/app/components/Navbar'
import Client from './Client'
import { fetchAllTutorialsWithSubtopic } from '@/app/db/operations/tutorials'

export type Topic = {
    id: string,
    title: string,
    subtopics: Subtopic[]
}

type Subtopic = {
    id: string,
    name: string
}

const topics: Topic[] = await fetchAllTutorialsWithSubtopic()

const page = () => {
    return (
        <div>
            <Navbar />
            <Client topics={topics} />
        </div>
    )
}

export default page
