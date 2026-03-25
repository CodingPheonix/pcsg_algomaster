import Navbar from '@/app/components/Navbar'
import Client from './Client'
import { fetchAllTutorialsWithSubtopic } from '@/app/db/operations/tutorials'

export const dynamic = "force-dynamic";

export type Topic = {
    id: string,
    title: string,
    subtopics: Subtopic[]
}

type Subtopic = {
    id: string,
    name: string
}

const page = async () => {
    const topics: Topic[] = await fetchAllTutorialsWithSubtopic()
    return (
        <div>
            <Navbar />
            <Client topics={topics} />
        </div>
    )
}

export default page
