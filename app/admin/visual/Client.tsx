import React from 'react'
import { Topic } from './page'
import VisualTopicCard from '@/app/components/VisualTopicCard'

const Client = ({ topics }: { topics: Topic[] }) => {

    console.log(topics)

    return (
        <div className="max-w-5xl mx-auto py-8 mt-15">
            <h2 className="text-3xl font-bold text-black mb-6">Select Section</h2>

            {topics.map((section, index) => (
                <div
                    key={index}
                    className="border border-gray-200 rounded-xl mb-8 bg-white shadow-sm overflow-hidden"
                >
                    {/* Section Title */}
                    <div className="bg-blue-500 text-white px-6 py-3 font-semibold text-lg">
                        #    {section.title}
                    </div>

                    {/* Topics */}
                    <div className="flex flex-col gap-3 p-5">
                        {section?.subtopics?.map((item, index) => (
                            <div
                                key={index}
                                className="border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-sm transition-all"
                            >
                                <VisualTopicCard {...item} />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Client
