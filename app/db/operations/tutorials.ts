"use server"

import { eq } from "drizzle-orm"
import { db } from "../index"
import { tutorialsTable } from "../schema"

export const insertTutorial = async ({ id, title, subtopic, authorId }: { id: string, title: string, subtopic: string[] | null, authorId: string }) => {
    try {
        await db
            .insert(tutorialsTable)
            .values({
                id,
                title,
                subtopic,
                authorId
            })
    } catch (error) {
        console.error("Error inserting tutorial:", error)
        throw error
    }
}

export const addSubTopic = async (id: string, subtopic: string) => {
    try {
        const tutorial = (await db.select().from(tutorialsTable).where(eq(tutorialsTable.id, id)))[0]

        const updatedSubtopics = [...(tutorial?.subtopic ?? []), subtopic]

        await db
            .update(tutorialsTable)
            .set({
                subtopic: updatedSubtopics,
            })
            .where(eq(tutorialsTable.id, id))

    } catch (error) {
        console.error(error)
    }
}

export const fetchTutorials = async (authorId: string) => {
    try {
        return await db
            .select()
            .from(tutorialsTable)
            .where(eq(tutorialsTable.authorId, authorId))
    } catch (error) {
        console.error("Error fetching tutorials:", error)
        throw error
    }
}