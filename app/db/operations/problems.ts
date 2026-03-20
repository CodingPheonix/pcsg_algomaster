'use server'

import { Problem } from "@/app/admin/problem/page";
import { db } from "..";
import { problemDescriptionTable, problemTable, problemVisualsTable, setProblemTable, setTable } from "../schema";
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

export const fetchAllSetProblemWithSolutionAndAnimations = async () => {
    try {
        const rows = await db
            .select({
                setId: setTable.id,
                setTitle: setTable.name,
                problemId: problemTable.id,
                problemTitle: problemTable.name,
                problemLink: problemTable.link,
                problemVideo: problemTable.video_link,
                problemDifficulty: problemTable.difficulty,
                problemHints: problemTable.hints,
                problemDescriptionId: problemDescriptionTable.id,
                problemVisuals: problemVisualsTable.id
            })
            .from(setTable)
            .leftJoin(
                setProblemTable,
                eq(setProblemTable.set_id, setTable.id)
            )
            .leftJoin(
                problemTable,
                eq(problemTable.id, setProblemTable.problem_id)
            )
            .leftJoin(
                problemDescriptionTable,
                eq(problemDescriptionTable.problem_id, problemTable.id)
            )
            .leftJoin(
                problemVisualsTable,
                eq(problemVisualsTable.problem_id, problemTable.id)
            )

            const setMap = new Map()

            for (const row of rows) {
                // 1. Create set if not exists
                if (!setMap.has(row.setId)) {
                    setMap.set(row.setId, {
                        id: row.setId,
                        title: row.setTitle,
                        problems: []
                    })
                }

                const set = setMap.get(row.setId)

                // 2. Skip if no problem (left join case)
                if (!row.problemId) continue

                // 3. Prevent duplicate problems
                let problem = set.problems.find((p: any) => p.id === row.problemId)

                if (!problem) {
                    problem = {
                        id: row.problemId,
                        title: row.problemTitle,
                        link: row.problemLink,
                        video: row.problemVideo,
                        difficulty: row.problemDifficulty,
                        hints: row.problemHints,
                        descriptionId: row.problemDescriptionId,
                        visualsId: row.problemVisuals,
                        status: false
                    }

                    set.problems.push(problem)
                }
            }

            return Array.from(setMap.values())

    } catch (error) {
        console.error(error)
    }
}