"use server"

import { eq } from "drizzle-orm"
import { db } from "../index"
import { SubTopic, subtopicTable, tutorialsTable, tutorialSubtopicsTable } from "../schema"

export const insertTutorial = async ({ id, title, authorId }: { id: string, title: string, authorId: string }) => {
    try {
        await db
            .insert(tutorialsTable)
            .values({
                id,
                title,
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

export const fetchTutorialsWithSubtopic = async (authorId: string) => {
    try {
        const rows = await db
            .select({
                tutorialId: tutorialsTable.id,
                tutorialTitle: tutorialsTable.title,
                subtopicId: subtopicTable.id,
                subtopicName: subtopicTable.name
            })
            .from(tutorialsTable)
            .leftJoin(
                tutorialSubtopicsTable,
                eq(tutorialSubtopicsTable.tutorialId, tutorialsTable.id)
            )
            .leftJoin(
                subtopicTable,
                eq(subtopicTable.id, tutorialSubtopicsTable.subtopicId)
            )
            .where(eq(tutorialsTable.authorId, authorId));

        const tutorialMap = new Map();

        for (const row of rows) {
            if (!tutorialMap.has(row.tutorialId)) {
                tutorialMap.set(row.tutorialId, {
                    id: row.tutorialId,
                    title: row.tutorialTitle,
                    subtopics: []
                });
            }

            if (row.subtopicId) {
                tutorialMap.get(row.tutorialId).subtopics.push({
                    id: row.subtopicId,
                    name: row.subtopicName
                });
            }
        }

        return Array.from(tutorialMap.values());
    } catch (error) {
        throw error;
    }
};