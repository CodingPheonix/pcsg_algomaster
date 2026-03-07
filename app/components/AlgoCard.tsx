'use client'

import React from 'react'
import { FileSpreadsheet, Play, Youtube } from 'lucide-react'
import { useRouter } from 'next/navigation';

export type CourseItem = {
    "id": string;
    "name": string;
    "description": string;
    "difficulty": string;
}

type AlgoCardProps = {
    "id": string;
    "heading": string;
    "course": CourseItem[];
}

const AlgoCard = (item: CourseItem) => {

    const router = useRouter();

    return (
        <div className='flex w-full justify-around items-center'>
            <h3 className="text-lg font-semibold w-1/4 text-start">{item.name}</h3>
            <p className="text-sm mt-2 w-1/4 text-start">{item.description}</p>
            <span className='w-1/4 flex justify-center items-center'>
                <span className={`inline-block px-2 py-1 text-md rounded-full font-semibold mt-2 ${item.difficulty === "Easy" ? "text-green-500" :
                    item.difficulty === "Medium" ? "text-yellow-500 " :
                        "text-red-500"
                    }`}>
                    {item.difficulty}
                </span>
            </span>
            <span className='flex w-1/4 justify-center items-center gap-3'>
                <button className=" text-black hover:text-blue-600 px-3 py-1 rounded mr-2">
                    <FileSpreadsheet className="w-4 h-4" />
                </button>
                <button onClick={() => {router.push(`/algorithms/tutorial?id=${item.id}`)}} className=" text-black hover:text-yellow-500 px-3 py-2 rounded">
                    <Play className="w-4 h-4" />
                </button>
                <button className=" text-black hover:text-red-500 px-3 py-2 rounded">
                    <Youtube className="w-4 h-4" />
                </button>
            </span>
        </div>
    )
}

export default AlgoCard
