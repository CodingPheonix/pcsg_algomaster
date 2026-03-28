// 'use server'

// import { eq } from "drizzle-orm"
// import { db } from ".."
// import { tutorialSubtopicsTable } from "../schema"

// export const addTutorialSubtopicsRelation = async (tutorialId: string, subtopicId: string) => {
//     try {
//         await db
//         .insert(tutorialSubtopicsTable)
//         .values({
//             tutorialId,
//             subtopicId
//         })
//     } catch (error) {
//         throw error;
//     }
// }

// export const removeTutorialSubTopicRelation = async (subtopicId: string) => {
//     try {
//         await db
//         .delete(tutorialSubtopicsTable)
//         .where(eq(tutorialSubtopicsTable.subtopicId, subtopicId))
//     } catch (error) {
//         console.error(error)
//     }
// }