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