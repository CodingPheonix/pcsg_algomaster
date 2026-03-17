'use client'

import TextEditor, { TutorialBlock } from '@/app/components/TextEditor'
import { fetchProblemDescription, insertProblemDescription, updateProblemDescription } from '@/app/db/operations/problemDescription'
import { Mixed } from '@/app/db/schema'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { toast, Toaster } from 'sonner'

const ProblemDescription = () => {

    const [prevBlocks, setprevBlocks] = useState<Mixed[] | null>([])

    const searchParams = useSearchParams()
    const problem_id = searchParams.get('id') as string || "";
    const title = searchParams.get("title")?.split("+").join(" ") as string || "";

    const handleSubmit = async (title: string, blocks: TutorialBlock[]) => {

        if (!prevBlocks) {
            await insertProblemDescription(title, blocks, problem_id);
        } else {
            await updateProblemDescription(problem_id, title, blocks);
        }

        toast("Post Updated")
    }

    useEffect(() => {
        const fetchBlocks = async () => {
            if (!problem_id) return;

            const blocks = await fetchProblemDescription(problem_id);
            blocks && setprevBlocks(blocks[0]?.content)
        }
        fetchBlocks()
    }, [problem_id])


    return (
        <div>
            <Toaster />

            <TextEditor
                taskId={problem_id}
                prevTitle={title}
                onSubmit={handleSubmit}
                prevBlocks={prevBlocks as TutorialBlock[] | null}
            />
        </div>
    )
}

const page = () => {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <ProblemDescription />
        </Suspense>
    )
}

export default page

