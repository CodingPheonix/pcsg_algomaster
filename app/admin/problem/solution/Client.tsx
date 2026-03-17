'use client'

import TextEditor, { TutorialBlock } from '@/app/components/TextEditor'
import { useSearchParams } from 'next/navigation'

const Client = () => {

    const searchParams = useSearchParams()
    const problem_id = searchParams.get('id') as string || "";
    const title = searchParams.get("title")?.split("+").join(" ") as string || "";

    const handleSubmit = (title: string, blocks: TutorialBlock[]) => {
        console.log("tutorial blocks", blocks, title)

        
    }

    return (
        <div>
            <TextEditor
                problemId={problem_id}
                prevTitle={title}
                onSubmit={handleSubmit}
             />
        </div>
    )
}

export default Client
