import React from 'react'
import Navbar from '../conponents/Navbar'
import { FileSpreadsheet, Play } from 'lucide-react'
import { content } from '../utils/json/algorithms'

const page = () => {
    return (
        <div className='bg-black'>
            <Navbar />

            <div className='pt-20 w-[75%] mx-auto'>
                <div className='flex justify-between items-center mb-5 mt-10'>
                    <h1 className="text-3xl font-bold text-white">Algorithm</h1>
                    <p className="text-gray-300">Last Updated: 2024-07-15</p>
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
                            {section.course.map((item) => (
                                <div key={item.id} className="bg-gray-900 p-4 rounded-lg border border-gray-700 flex justify-around items-center hover:cursor-pointer">
                                    <h3 className="text-lg font-semibold text-white w-1/4 text-start">{item.name}</h3>
                                    <p className="text-sm text-gray-300 mt-2 w-1/4 text-start">{item.description}</p>
                                    <span className='w-1/4 flex justify-center items-center'>
                                        <span className={`inline-block px-2 py-1 text-md rounded-full mt-2 ${item.difficulty === "Easy" ? "text-green-500" :
                                            item.difficulty === "Medium" ? "text-yellow-500 " :
                                                "text-red-500"
                                            }`}>
                                            {item.difficulty}
                                        </span>
                                    </span>
                                    <span className='flex w-1/4 justify-center items-center gap-3'>
                                        <button className="hover:bg-gray-800 text-white hover:text-blue-600 px-3 py-1 rounded mr-2">
                                            <FileSpreadsheet className="w-4 h-4" />
                                        </button>
                                        <button className="hover:bg-gray-800 text-white hover:text-red-500 px-3 py-2 rounded">
                                            <Play className="w-4 h-4" />
                                        </button>
                                    </span>
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
