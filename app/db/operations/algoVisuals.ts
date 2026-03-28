'use server'

import { VisualizerAction } from "@/app/admin/visual/create/tools"
import { db } from ".."
// import { algoVisualsTable } from "../schema"
import { v4 as UUIDv4 } from "uuid"
import { eq } from "drizzle-orm"
import { prisma } from "../prisma"

export const insertVisuals = async ({ subTopicId, code, codeSteps, inputValues }: {
    subTopicId: string,
    code: string,
    codeSteps: VisualizerAction[],
    inputValues: string
}) => {
    try {
        // await db
        //     .insert(algoVisualsTable)
        //     .values({
        //         id: UUIDv4(),
        //         subtopic_id: subTopicId,
        //         code_text: code,
        //         code_steps: codeSteps,
        //         input_array: inputValues
        //     })

        await prisma.algovisuals_table.create({
            data: {
                id: UUIDv4(),
                subtopic_id: subTopicId,
                code_text: code,
                code_steps: JSON.stringify(codeSteps),
                input_array: inputValues
            }
        })
    } catch (error) {
        console.error(error)
    }
}

export const fetchVisuals = async (subTopicId: string) => {
    try {
        // return await db
        //     .select({
        //         'code': algoVisualsTable.code_text,
        //         'steps': algoVisualsTable.code_steps,
        //         'inputArray': algoVisualsTable.input_array
        //     })
        //     .from(algoVisualsTable)
        //     .where(eq(algoVisualsTable.subtopic_id, subTopicId))

        const ans = await prisma.algovisuals_table.findFirst({
            where: {
                subtopic_id: subTopicId
            }
        })

        return {
            'code': ans?.code_text,
            'steps': ans?.code_steps,
            'inputArray': ans?.input_array
        }
    } catch (error) {
        console.error(error)
    }
}