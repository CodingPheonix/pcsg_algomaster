'use server'

import { eq } from "drizzle-orm"
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

export const editSubTopic = async (subTopic: SubTopic) => {
    try {
        await db
            .update(subtopicTable)
            .set({
                name: subTopic.name,
                description: subTopic.description,
                difficulty: subTopic.difficulty,
                external_video: subTopic.external_video
            })
            .where(eq(subtopicTable.id, subTopic.id))

    } catch (error) {
        console.error(error)
    }
}

export const remove_Subtopic = async (subtopicId: string) => {
    try {
        await db
            .delete(subtopicTable)
            .where(eq(subtopicTable.id, subtopicId))
    } catch (error) {
        console.error(error)
    }
}