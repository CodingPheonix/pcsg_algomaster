'use server'

import { eq } from "drizzle-orm"
import { db } from ".."
import { userProblemTable } from "../schema"
import { v4 } from "uuid"


export const fetchAllProblemStatus = async (userId: string) => {
    try {
        return await db
            .select({
                problemList: userProblemTable.problem_ids
            })
            .from(userProblemTable)
            .where(eq(userProblemTable.user_id, userId))
    } catch (error) {
        console.error(error)
    }
}

export const updateAddProblemStatus = async (userId: string, problemId: string) => {
    try {
        const existingSet = await db.select().from(userProblemTable).where(eq(userProblemTable.user_id, userId))

        if (existingSet[0]?.id) {
            const current = existingSet[0].problem_ids || []

            const updated = current.includes(problemId)
                ? current
                : [...current, problemId]

            await db
                .update(userProblemTable)
                .set({ problem_ids: updated })
                .where(eq(userProblemTable.id, existingSet[0].id))
        } else {

            const problemArr = [problemId]

            await db
            .insert(userProblemTable)
            .values({
                id: v4(),
                user_id: userId,
                problem_ids: problemArr
            })
        }
    } catch (error) {
        console.error(error)
    }
}

export const updateRemoveProblemStatus = async (userId: string, problemId: string) => {
  try {
    const existingSet = await db
      .select()
      .from(userProblemTable)
      .where(eq(userProblemTable.user_id, userId))

    if (!existingSet[0]?.id) return

    const current = existingSet[0].problem_ids || []

    // remove the problemId
    const updated = current.filter(id => id !== problemId)

    await db
      .update(userProblemTable)
      .set({ problem_ids: updated })
      .where(eq(userProblemTable.id, existingSet[0].id))
  } catch (error) {
    console.error(error)
  }
}