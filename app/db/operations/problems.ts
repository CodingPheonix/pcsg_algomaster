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

export const fetchProblemHints = async (problemId: string) => {
    try {
        return await db
            .select({
                Hints: problemTable.hints
            })
            .from(problemTable)
            .where(eq(problemTable.id, problemId))
    } catch (error) {
        console.log(error)
    }
}

export const updateProblem = async (problem: Problem) => {

    console.log(problem)
    try {
        await db
            .update(problemTable)
            .set({
                name: problem.name,
                link: problem.link,
                difficulty: problem.difficulty,
                video_link: problem.videoLink,
            })
            .where(eq(problemTable.id, problem.id))
    } catch (error) {
        console.error(error)
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

export const uploadHints = async (problemId: string, hints: string[]) => {
    try {
        await db
            .update(problemTable)
            .set({ hints: hints })
            .where(eq(problemTable.id, problemId));
    } catch (error) {
        console.error(error);
    }
}

export const getTotalProblemCount = async () => {
    try {
        return await db
        .$count(problemTable)
    } catch (error) {
        console.error(error)
    }
}