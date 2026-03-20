'use server'

import { eq } from "drizzle-orm"
import { db } from ".."
import { userProblemTable } from "../schema"


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