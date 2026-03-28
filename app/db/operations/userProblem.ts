'use server'

import { eq } from "drizzle-orm"
import { db } from ".."
import { userProblemTable } from "../schema"
import { v4 } from "uuid"
import { prisma } from "../prisma"


export const fetchAllProblemStatus = async (userId: string) => {
    try {
        // return await db
        //     .select({
        //         problemList: userProblemTable.problem_ids
        //     })
        //     .from(userProblemTable)
        //     .where(eq(userProblemTable.user_id, userId))

        const res = await prisma.user_problem.findUnique({
            where: {
                user_id: userId
            }
        })

        return res?.problem_ids
    } catch (error) {
        console.error(error)
    }
}

export const updateAddProblemStatus = async (userId: string, problemId: string) => {
    try {
        // const existingSet = await db.select().from(userProblemTable).where(eq(userProblemTable.user_id, userId))

        const existingSet = await prisma.user_problem.findFirst({ where: { user_id: userId } })

        if (existingSet?.id) {
            const current = existingSet.problem_ids as string[] || []

            const updated = current.includes(problemId)
                ? current
                : [...current, problemId]

            // await db
            //     .update(userProblemTable)
            //     .set({ problem_ids: updated })
            //     .where(eq(userProblemTable.id, existingSet[0].id))

            await prisma.user_problem.update({
                where: {
                    id: existingSet.id
                },
                data: {
                    problem_ids: updated
                }
            })
        } else {

            const problemArr = [problemId]

            // await db
            // .insert(userProblemTable)
            // .values({
            //     id: v4(),
            //     user_id: userId,
            //     problem_ids: problemArr
            // })

            await prisma.user_problem.create({
                data: {
                    id: v4(),
                    user_id: userId,
                    problem_ids: problemArr
                }
            })
        }
    } catch (error) {
        console.error(error)
    }
}

export const updateRemoveProblemStatus = async (userId: string, problemId: string) => {
    try {
        // const existingSet = await db
        //     .select()
        //     .from(userProblemTable)
        //     .where(eq(userProblemTable.user_id, userId))

        const existingSet = await prisma.user_problem.findFirst({
            where: {
                user_id: userId
            }
        })

        if (!existingSet?.id) return

        const current = existingSet.problem_ids as string[] || []

        // remove the problemId
        const updated = current.filter(id => id !== problemId)

        // await db
        //     .update(userProblemTable)
        //     .set({ problem_ids: updated })
        //     .where(eq(userProblemTable.id, existingSet[0].id))

        await prisma.user_problem.update({
            where: {
                id: existingSet.id
            },
            data: {
                problem_ids: updated
            }
        })
    } catch (error) {
        console.error(error)
    }
}