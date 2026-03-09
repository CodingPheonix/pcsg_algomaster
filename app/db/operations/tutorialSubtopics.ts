'use server'

import { db } from ".."
import { tutorialSubtopicsTable } from "../schema"

export const addTutorialSubtopicsRelation = async (tutorialId: string, subtopicId: string) => {
    try {
        await db
        .insert(tutorialSubtopicsTable)
        .values({
            tutorialId,
            subtopicId
        })
    } catch (error) {
        throw error;
    }
}