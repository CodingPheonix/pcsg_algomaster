'use client'

import TextEditor, { TutorialBlock } from '@/app/components/TextEditor'
import { fetchProblemDescription, insertProblemDescription, updateProblemDescription } from '@/app/db/operations/problemDescription'
import { fetchProblemHints, uploadHints } from '@/app/db/operations/problems'
import { Mixed } from '@/app/db/schema'
import { useSearchParams } from 'next/navigation'
import React, { Suspense, useEffect, useState } from 'react'
import { toast, Toaster } from 'sonner'

type HintKeys = "hint1" | "hint2" | "hint3";

const ProblemDescription = () => {

    const [prevBlocks, setprevBlocks] = useState<Mixed[] | null>(null);
    const [hints, setHints] = useState<Record<HintKeys, string>>({
        hint1: "",
        hint2: "",
        hint3: "",
    });

    const searchParams = useSearchParams()
    const problem_id = searchParams.get('id') as string || "";
    const title = searchParams.get("title")?.split("+").join(" ") as string || "";

    const handleSubmit = async (title: string, blocks: TutorialBlock[]) => {

        if (!prevBlocks) {
            await insertProblemDescription(title, blocks, problem_id);
        } else {
            await updateProblemDescription(problem_id, title, blocks);
        }

        await uploadHints(problem_id, [hints.hint1, hints.hint2, hints.hint3]);

        toast("Post Updated");
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHints({ ...hints, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        const fetchBlocks = async () => {
            if (!problem_id) return;

            const [blocks, problem] = await Promise.all([fetchProblemDescription(problem_id), fetchProblemHints(problem_id)]);

            blocks && setprevBlocks(blocks?.content ? JSON.parse(blocks.content) : []);
            // problem && JSON.parse(problem as string[]).map((hint, index) => {
            //     setHints(prev => ({ ...prev, [`hint${index + 1}` as HintKeys]: hint }));
            // }) 
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

            <div className="relative w-[70%] mx-auto mb-7 p-px rounded-2xl bg-linear-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30">

                <div className="bg-white rounded-2xl p-6 shadow-md space-y-5">

                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-800">
                            💡 Hints
                        </h2>
                        <span className="text-xs text-gray-400">
                            Optional but helpful
                        </span>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-4">
                        {(["hint1", "hint2", "hint3"] as HintKeys[]).map(
                            (hint, index) => (
                                <div key={hint} className="relative">

                                    {/* Label */}
                                    <label className="text-xs text-gray-500 mb-1 block">
                                        Hint {index + 1}
                                    </label>

                                    {/* Input */}
                                    <input
                                        type="text"
                                        name={hint}
                                        placeholder={`Enter hint ${index + 1}...`}
                                        value={hints[hint]}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition"
                                    />
                                </div>
                            )
                        )}
                    </div>

                </div>
            </div>
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

