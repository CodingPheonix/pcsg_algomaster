// 'use server'

// import { v4 } from "uuid"
// import { db } from ".."
// import { setProblemTable } from "../schema"
// import { eq } from "drizzle-orm"

// export const insertSetProblem = async (setId: string, problemId: string) => {
//     try {
//         await db
//         .insert(setProblemTable)
//         .values({
//             id: v4(),
//             set_id: setId,
//             problem_id: problemId
//         })
//     } catch (error) {
//         console.error(error)
//     }
// }

// export const deleteSetProblem = async (problemId: string) => {
//     try {
//         await db
//         .delete(setProblemTable)
//         .where(eq(setProblemTable.problem_id, problemId))
//     } catch (error) {
//         console.error(error)
//     }
// }