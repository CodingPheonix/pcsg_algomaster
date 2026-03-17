'use server'

import { v4 } from "uuid"
import { db } from ".."
import { problemDescriptionTable } from "../schema"
import { TutorialBlock } from "@/app/components/TextEditor"
import { eq } from "drizzle-orm"


export const insertProblemDescription = async (title: string, content: TutorialBlock[], problemId: string) => {
    try {
        await db
            .insert(problemDescriptionTable)
            .values({
                id: v4(),
                title,
                content,
                problem_id: problemId
            })
    } catch (error) {
        console.error(error)
    }
}

export const fetchProblemDescription = async (problemId: string) => {
    try {
        return await db
            .select()
            .from(problemDescriptionTable)
            .where(eq(problemDescriptionTable.problem_id, problemId))
    } catch (error) {
        console.error(error)
    }
}

export const updateProblemDescription = async (
    problemId: string,
    title: string,
    content: TutorialBlock[]
) => {
    try {
        await db
            .update(problemDescriptionTable)
            .set({
                title,
                content
            })
            .where(eq(problemDescriptionTable.problem_id, problemId));
    } catch (error) {
        console.error(error);
    }
};

export const deleteProblemDescription = async (problemId: string) => {
    try {
        await db
            .delete(problemDescriptionTable)
            .where(eq(problemDescriptionTable.problem_id, problemId));
    } catch (error) {
        console.error(error);
    }
};