'use server'

import { eq } from "drizzle-orm"
import { db } from ".."
import { problemTable, setProblemTable, setTable } from "../schema"
import type { Problem } from "@/app/admin/problem/page"


export const insertSet = async (id: string, name: string, author_id: string) => {
    try {
        await db
            .insert(setTable)
            .values({
                id,
                name,
                author_id
            })
    } catch (error) {
        console.error(error)
    }
}

export const fetchSetWithProblemsById = async (userId: string) => {
    try {
        const rows = await db
            .select({
                setId: setTable.id,
                setName: setTable.name,
                problemId: problemTable.id,
                problemName: problemTable.name,
                problemLink: problemTable.link,
                problemDifficulty: problemTable.difficulty,
                problemVideoLink: problemTable.video_link
            })
            .from(setTable)
            .where(eq(setTable.author_id, userId))
            .leftJoin(
                setProblemTable,
                eq(setProblemTable.set_id, setTable.id)
            )
            .leftJoin(
                problemTable,
                eq(problemTable.id, setProblemTable.problem_id)
            );

        const setMap = new Map<
            string,
            {
                id: string;
                name: string;
                problems: Problem[];
            }
        >();

        for (const row of rows) {
            if (!setMap.has(row.setId)) {
                setMap.set(row.setId, {
                    id: row.setId,
                    name: row.setName,
                    problems: []
                });
            }

            const set = setMap.get(row.setId);

            if (row.problemId && set) {
                set.problems.push({
                    id: row.problemId,
                    name: row.problemName as string,
                    link: row.problemLink as string,
                    difficulty: row.problemDifficulty as "Easy" | "Normal" | "Hard",
                    videoLink: row.problemVideoLink as string
                });
            }
        }

        return Array.from(setMap.values());

    } catch (error) {
        throw error;
    }
};

export const deleteSetById = async (id: string) => {
    try {
        await db
            .delete(setTable)
            .where(eq(setTable.id, id))
    } catch (error) {
        console.error(error)
    }
}