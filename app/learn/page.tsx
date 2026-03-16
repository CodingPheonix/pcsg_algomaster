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
    difficulty: "Easy" | "Normal" | "Hard",
    externalLink: string
}

export type Tutorial = {
    id: string,
    subtopics: Topic[],
    title: string,
    type: string
}


const Client = () => {

    const [currentMenu, setCurrentMenu] = useState<"algorithm" | "data_structure">("algorithm")
    const [tutorialTopics, setTutorialTopics] = useState<Tutorial[]>([{
        id: "",
        subtopics: [],
        title: "",
        type: ""
    }])
    const [filteredTopics, setFilteredTopics] = useState<Tutorial[]>([{
        id: "",
        subtopics: [],
        title: "",
        type: ""
    }])

    useEffect(() => {
        const fetchTutorials = async () => {
            const tutorial_topics = await fetchAllTutorialsWithSubtopic() as unknown as Tutorial[];
            setTutorialTopics(tutorial_topics)
        }
        fetchTutorials()
    }, [])

    useEffect(() => {
        if (tutorialTopics.length === 0) return;

        setFilteredTopics(tutorialTopics.filter(topic => topic.type === currentMenu))
    }, [currentMenu, tutorialTopics])


    return (
        <div className='bg-white text-black'>
            <Navbar />

            <div className='pt-20 w-[75%] mx-auto'>
                <div className='flex justify-between items-baseline mb-5 mt-10'>
                    <div className="flex justify-center items-center gap-2 rounded-2xl bg-blue-100 p-2 shadow-[inset_0_2px_6px_rgba(0,0,0,0.08)]">

                        <h1
                            onClick={() => { setCurrentMenu("algorithm") }}
                            className={`px-4 py-2 rounded-xl text-lg font-bold transition-all hover:cursor-pointer
                                ${currentMenu === "algorithm"
                                    ? "bg-white text-blue-600 shadow-sm"
                                    : "text-blue-500 hover:bg-white/40"}
                                `}
                        >
                            Algorithm
                        </h1>

                        <h1
                            onClick={() => { setCurrentMenu("data_structure") }}
                            className={`px-4 py-2 rounded-xl text-lg font-bold transition-all hover:cursor-pointer
                                ${currentMenu === "data_structure"
                                    ? "bg-white text-blue-600 shadow-sm"
                                    : "text-blue-500 hover:bg-white/40"}
                                `}
                        >
                            Data Structure
                        </h1>

                    </div>
                </div>

                <div className='w-full mx-auto my-2 h-auto bg-white text-gray-400 p-3 rounded-t-lg font-mono text-start border border-blue-500 rounded-xl'>
                    <div className='w-[90%] mx-auto flex'>
                        <p className="w-1/4">Heading</p>
                        <p className="w-1/4">Description</p>
                        <p className="w-1/4 text-center">Difficulty</p>
                        <p className='w-1/4 text-center'>Actions</p>
                    </div>
                </div>

                {filteredTopics.map((section, index) => (
                    <div key={index} className="border border-gray-800 ">
                        <h2 className="text-xl font-bold w-full bg-blue-500 text-white p-2">#  {section.title}</h2>
                        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4"> */}
                        <div className="flex flex-col mt-4 mb-3 w-[90%] mx-auto gap-4">
                            {section?.subtopics.length > 0 ? section.subtopics.map((item, index) => (
                                <div key={index} className="text-black p-4 rounded-lg border border-gray-700 flex justify-around items-center">
                                    <AlgoCard {...item} />
                                </div>
                            )) : (
                                <div className='text-center'>
                                    No topic added
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Client
