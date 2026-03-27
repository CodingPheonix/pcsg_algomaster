'use server'

import { eq } from "drizzle-orm"
import { db } from ".."
import { problemTable, setProblemTable, setTable } from "../schema"
import type { Problem } from "@/app/admin/problem/page"
import { prisma } from "../prisma"


export const insertSet = async (id: string, name: string, author_id: string) => {
    try {
        // await db
        //     .insert(setTable)
        //     .values({
        //         id,
        //         name,
        //         author_id
        //     })

        await prisma.set_table.create({
            data: {
                id,
                name,
                author_id
            }
        })
    } catch (error) {
        console.error(error)
    }
}

export const fetchSetWithProblemsById = async (userId: string) => {
    try {
        // const rows = await db
        //     .select({
        //         setId: setTable.id,
        //         setName: setTable.name,
        //         problemId: problemTable.id,
        //         problemName: problemTable.name,
        //         problemLink: problemTable.link,
        //         problemDifficulty: problemTable.difficulty,
        //         problemVideoLink: problemTable.video_link
        //     })
        //     .from(setTable)
        //     .where(eq(setTable.author_id, userId))
        //     .leftJoin(
        //         setProblemTable,
        //         eq(setProblemTable.set_id, setTable.id)
        //     )
        //     .leftJoin(
        //         problemTable,
        //         eq(problemTable.id, setProblemTable.problem_id)
        //     );

        // const setMap = new Map<
        //     string,
        //     {
        //         id: string;
        //         name: string;
        //         problems: Problem[];
        //     }
        // >();

        // for (const row of rows) {
        //     if (!setMap.has(row.setId)) {
        //         setMap.set(row.setId, {
        //             id: row.setId,
        //             name: row.setName,
        //             problems: []
        //         });
        //     }

        //     const set = setMap.get(row.setId);

        //     if (row.problemId && set) {
        //         set.problems.push({
        //             id: row.problemId,
        //             name: row.problemName as string,
        //             link: row.problemLink as string,
        //             difficulty: row.problemDifficulty as "Easy" | "Normal" | "Hard",
        //             videoLink: row.problemVideoLink as string
        //         });
        //     }
        // }

        // return Array.from(setMap.values());


        const sets = await prisma.set_table.findMany({
            where: {
                author_id: userId
            },
            include: {
                problem_table: true
            }
        });

        const result = sets.map(set => ({
            id: set.id,
            name: set.name,
            problems: set.problem_table.map(problem => ({
                id: problem.id,
                name: problem.name,
                link: problem.link,
                difficulty: problem.difficulty as "Easy" | "Normal" | "Hard",
                videoLink: problem.video_link
            }))
        }));

        return result;

    } catch (error) {
        throw error;
    }
};

export const deleteSetById = async (id: string) => {
    try {
        // await db
        //     .delete(setTable)
        //     .where(eq(setTable.id, id))

        await prisma.set_table.delete({
            where: {
                id
            }
        })
    } catch (error) {
        console.error(error)
    }
}