import React from 'react'
import Navbar from '../components/Navbar'
import { content } from '../utils/json/algorithms'
import AlgoCard from '../components/AlgoCard'

const page = () => {
    return (
        <div className='bg-black'>
            <Navbar />

            <div className='pt-20 w-[75%] mx-auto'>
                <div className='flex justify-between items-baseline mb-5 mt-10'>
                    <h1 className="text-3xl font-bold text-white">Algorithm</h1>
                    <p className="text-gray-300 text-sm">Last Updated: 2026-02-24</p>
                </div>

                <div className='w-full mx-auto my-2 h-auto bg-black text-gray-400 p-3 rounded-t-lg font-mono text-start border border-green-500 rounded-xl'>
                    <div className='w-[90%] mx-auto flex'>
                        <p className="w-1/4">Heading</p>
                        <p className="w-1/4">Description</p>
                        <p className="w-1/4 text-center">Difficulty</p>
                        <p className='w-1/4 text-center'>Actions</p>
                    </div>
                </div>

                {content.map((section, index) => (
                    <div key={index} className="border border-gray-800 ">
                        <h2 className="text-xl font-bold w-full bg-green-500 text-black p-2">#  {section.heading}</h2>
                        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4"> */}
                        <div className="flex flex-col mt-4 mb-3 w-[90%] mx-auto gap-4">
                            {section.course.map((item, index) => (
                                <div key={index} className="bg-gray-900 p-4 rounded-lg border border-gray-700 flex justify-around items-center hover:cursor-pointer">
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

export default page
