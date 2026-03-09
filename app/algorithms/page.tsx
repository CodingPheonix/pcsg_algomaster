'use client'

import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import AlgoCard from '../components/AlgoCard'
import { fetchAllTutorialsWithSubtopic } from '../db/operations/tutorials'
import { useState } from 'react'

type Topic = {
    id: string,
    name: string,
    description: string,
    difficulty: string,
    externalLink: string
}

export type Tutorial = {
    id: string,
    subtopics: Topic[],
    title: string
}


const Client = () => {

    const [tutorialTopics, setTutorialTopics] = useState<Tutorial[]>([{
        id: "",
        subtopics: [],
        title: ""
    }])
    
    useEffect(() => {
        const fetchTutorials = async () => {
            const tutorial_topics = await fetchAllTutorialsWithSubtopic() as unknown as Tutorial[];
            setTutorialTopics(tutorial_topics)
        }
        fetchTutorials()
    }, [])
    

    return (
        <div className='bg-white text-black'>
            <Navbar />

            <div className='pt-20 w-[75%] mx-auto'>
                <div className='flex justify-between items-baseline mb-5 mt-10'>
                    <h1 className="text-3xl font-bold text-blue-500">Algorithm</h1>
                    <p className="text-gray-400 text-sm">Last Updated: 2026-02-24</p>
                </div>

                <div className='w-full mx-auto my-2 h-auto bg-white text-gray-400 p-3 rounded-t-lg font-mono text-start border border-blue-500 rounded-xl'>
                    <div className='w-[90%] mx-auto flex'>
                        <p className="w-1/4">Heading</p>
                        <p className="w-1/4">Description</p>
                        <p className="w-1/4 text-center">Difficulty</p>
                        <p className='w-1/4 text-center'>Actions</p>
                    </div>
                </div>

                {tutorialTopics.map((section, index) => (
                    <div key={index} className="border border-gray-800 ">
                        <h2 className="text-xl font-bold w-full bg-blue-500 text-white p-2">#  {section.title}</h2>
                        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4"> */}
                        <div className="flex flex-col mt-4 mb-3 w-[90%] mx-auto gap-4">
                            {section.subtopics.map((item, index) => (
                                <div key={index} className="text-black p-4 rounded-lg border border-gray-700 flex justify-around items-center">
                                    <AlgoCard {...item} />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Client
