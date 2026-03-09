'use server'

import { db } from ".."
import { SubTopic, subtopicTable } from "../schema"

export const addSubTopic = async (subTopic: SubTopic) => {
    try {
        await db
            .insert(subtopicTable)
            .values({
                id: subTopic.id,
                name: subTopic.name,
                description: subTopic.description,
                difficulty: subTopic.difficulty,
                external_video: subTopic.external_video
            })

    } catch (error) {
        console.error(error)
    }
}