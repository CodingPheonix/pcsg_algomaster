'use server'

import { Problem } from "@/app/admin/problem/page";
import { db } from "..";
import { problemDescriptionTable, problemTable, problemVisualsTable, setProblemTable, setTable } from "../schema";
import { eq } from "drizzle-orm";
import { prisma } from "../prisma";


export const insertProblem = async (problem: Problem, authorId: string, setId: string) => {
    try {
        // await db
        //     .insert(problemTable)
        //     .values({
        //         id: problem.id,
        //         name: problem.name,
        //         link: problem.link,
        //         difficulty: problem.difficulty,
        //         video_link: problem.videoLink,
        //         author_id: authorId
        //     })

        await prisma.problem_table.create({
            data: {
                id: problem.id,
                name: problem.name,
                link: problem.link,
                difficulty: problem.difficulty,
                video_link: problem.videoLink,
                author_id: authorId,
                set_id: setId
            }
        })
    } catch (error) {
        console.error(error);
    }
}

export const fetchProblemHints = async (problemId: string) => {
    try {
        // return await db
        //     .select({
        //         Hints: problemTable.hints
        //     })
        //     .from(problemTable)
        //     .where(eq(problemTable.id, problemId))

        const res = await prisma.problem_table.findFirst({
            where: {
                id: problemId
            },
        })

        return res?.hints
    } catch (error) {
        console.log(error)
    }
}

export const updateProblem = async (problem: Problem) => {

    console.log(problem)
    try {
        // await db
        //     .update(problemTable)
        //     .set({
        //         name: problem.name,
        //         link: problem.link,
        //         difficulty: problem.difficulty,
        //         video_link: problem.videoLink,
        //     })
        //     .where(eq(problemTable.id, problem.id))

        await prisma.problem_table.update({
            where: {
                id: problem.id
            },
            data: {
                name: problem.name,
                link: problem.link,
                difficulty: problem.difficulty,
                video_link: problem.videoLink,
            }
        })
    } catch (error) {
        console.error(error)
    }
}

export const removeProblem = async (problemId: string) => {
    try {
        // await db
        //     .delete(problemTable)
        //     .where(eq(problemTable.id, problemId))

        await prisma.problem_table.delete({
            where: {
                id: problemId
            }
        })
    } catch (error) {
        console.error(error)
    }
}

export const uploadHints = async (problemId: string, hints: string[]) => {
    try {
        // await db
        //     .update(problemTable)
        //     .set({ hints: hints })
        //     .where(eq(problemTable.id, problemId));

        await prisma.problem_table.update({
            where: {
                id: problemId
            },
            data: {
                hints: hints
            }
        })
    } catch (error) {
        console.error(error);
    }
}

export const getTotalProblemCount = async () => {
    try {
        // return await db
        //     .$count(problemTable)

        return prisma.problem_table.count()
    } catch (error) {
        console.error(error)
    }
}

export const fetchAllSetProblemWithSolutionAndAnimations = async () => {
    try {
        // const rows = await db
        //     .select({
        //         setId: setTable.id,
        //         setTitle: setTable.name,
        //         problemId: problemTable.id,
        //         problemTitle: problemTable.name,
        //         problemLink: problemTable.link,
        //         problemVideo: problemTable.video_link,
        //         problemDifficulty: problemTable.difficulty,
        //         problemHints: problemTable.hints,
        //         problemDescriptionId: problemDescriptionTable.id,
        //         problemVisuals: problemVisualsTable.id
        //     })
        //     .from(setTable)
        //     .leftJoin(
        //         setProblemTable,
        //         eq(setProblemTable.set_id, setTable.id)
        //     )
        //     .leftJoin(
        //         problemTable,
        //         eq(problemTable.id, setProblemTable.problem_id)
        //     )
        //     .leftJoin(
        //         problemDescriptionTable,
        //         eq(problemDescriptionTable.problem_id, problemTable.id)
        //     )
        //     .leftJoin(
        //         problemVisualsTable,
        //         eq(problemVisualsTable.problem_id, problemTable.id)
        //     )

        // const setMap = new Map()

        // for (const row of rows) {
        //     // 1. Create set if not exists
        //     if (!setMap.has(row.setId)) {
        //         setMap.set(row.setId, {
        //             id: row.setId,
        //             title: row.setTitle,
        //             problems: []
        //         })
        //     }

        //     const set = setMap.get(row.setId)

        //     // 2. Skip if no problem (left join case)
        //     if (!row.problemId) continue

        //     // 3. Prevent duplicate problems
        //     let problem = set.problems.find((p: any) => p.id === row.problemId)

        //     if (!problem) {
        //         problem = {
        //             id: row.problemId,
        //             title: row.problemTitle,
        //             link: row.problemLink,
        //             video: row.problemVideo,
        //             difficulty: row.problemDifficulty,
        //             hints: row.problemHints,
        //             descriptionId: row.problemDescriptionId,
        //             visualsId: row.problemVisuals,
        //             status: false
        //         }

        //         set.problems.push(problem)
        //     }
        // }

        // return Array.from(setMap.values())

        const sets = await prisma.set_table.findMany({
            include: {
                problem_table: {
                    include: {
                        problem_description: true,
                        problem_visuals: true
                    }
                }
            }
        });

        // Transform to match your previous structure
        const result = sets.map((set: { id: any; name: any; problem_table: any[]; }) => ({
            id: set.id,
            title: set.name,
            problems: set.problem_table.map(problem => ({
                id: problem.id,
                title: problem.name,
                link: problem.link,
                video: problem.video_link,
                difficulty: problem.difficulty,
                hints: problem.hints,
                descriptionId: problem.problem_description?.id || null,
                visualsId: problem.problem_visuals?.id || null,
                status: false
            }))
        }));

        return result;


    } catch (error) {
        console.error(error)
    }
}