'use server'

import { VisualizerAction } from "@/app/admin/visual/create/tools"
import { db } from ".."
import { problemVisualsTable } from "../schema"
import { v4 as UUIDv4 } from "uuid"
import { eq } from "drizzle-orm"
import { prisma } from "../prisma"

export const insertProblemVisuals = async ({ problemId, codeText, codeSteps, inputArray }: {
    problemId: string,
    codeText: string,
    codeSteps: VisualizerAction[],
    inputArray: string
}) => {
    try {
        // await db
        //     .insert(problemVisualsTable)
        //     .values({
        //         id: UUIDv4(),
        //         problem_id: problemId,
        //         code_text: codeText,
        //         code_steps: codeSteps,
        //         input_array: inputArray
        //     })

        await prisma.problem_visuals.create({
            data: {
                id: UUIDv4(),
                problem_id: problemId,
                code_text: codeText,
                code_steps: codeSteps.toString(),
                input_array: inputArray
            }
        })
    } catch (error) {
        console.error(error)
    }
}

export const fetchProblemVisuals = async (problemId: string) => {
    try {
        // return await db
        //     .select({
        //         'codeText': problemVisualsTable.code_text,
        //         'codeSteps': problemVisualsTable.code_steps,
        //         'inputArray': problemVisualsTable.input_array
        //     })
        //     .from(problemVisualsTable)
        //     .where(eq(problemVisualsTable.problem_id, problemId))

        const res = await prisma.problem_visuals.findFirst({
            where: {
                problem_id: problemId
            }
        })

        return {
            codeText: res?.code_text,
            codeSteps: res?.code_steps,
            inputArray: res?.input_array
        }
    } catch (error) {
        console.error(error)
    }
}

export const updateProblemVisuals = async (problemId: string, { codeText, codeSteps, inputArray }: {
    codeText?: string,
    codeSteps?: VisualizerAction[],
    inputArray?: string
}) => {
    try {
        // await db
        //     .update(problemVisualsTable)
        //     .set({
        //         ...(codeText && { code_text: codeText }),
        //         ...(codeSteps && { code_steps: codeSteps }),
        //         ...(inputArray && { input_array: inputArray })
        //     })
        //     .where(eq(problemVisualsTable.problem_id, problemId))

        await prisma.problem_visuals.update({
            where: {
                problem_id: problemId
            },
            data: {
                ...(codeText && { code_text: codeText }),
                ...(codeSteps && { code_steps: codeSteps.toString() }),
                ...(inputArray && { input_array: inputArray })
            }
        })
    } catch (error) {
        console.error(error)
    }
}

export const deleteProblemVisuals = async (problemId: string) => {
    try {
        // await db
        //     .delete(problemVisualsTable)
        //     .where(eq(problemVisualsTable.problem_id, problemId))

        await prisma.problem_visuals.delete({
            where: {
                problem_id: problemId
            }
        })
    } catch (error) {
        console.error(error)
    }
}
