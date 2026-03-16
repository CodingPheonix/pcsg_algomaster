'use server'

import { Problem } from "@/app/admin/problem/page";
import { db } from "..";
import { problemTable } from "../schema";
import { eq } from "drizzle-orm";


export const insertProblem = async (problem: Problem, setId: string, authorId: string) => {
    try {
        await db
        .insert(problemTable)
        .values({
            id: problem.id,
            name: problem.name,
            link: problem.link,
            difficulty: problem.difficulty,
            video_link: problem.videoLink,
            set_id: setId,
            author_id: authorId
        })
    } catch (error) {
        console.error(error);
    }
}

export const removeProblem = async (problemId: string) => {
    try {
        await db
        .delete(problemTable)
        .where(eq(problemTable.id, problemId))
    } catch (error) {
        console.error(error)
    }
}