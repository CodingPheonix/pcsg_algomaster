'use server'

import { eq } from "drizzle-orm"
import { db } from ".."
import { commentsTable } from "../schema"
import { prisma } from "../prisma"

export const uploadComment = async ({ id, topic_id, username, message, time }: { id: string, topic_id: string, username: string, message: string, time: Date }) => {
    try {
        // await db
        // .insert(commentsTable)
        // .values({
        //     id,
        //     topic_id,
        //     username,
        //     message,
        //     time
        // })

        await prisma.comments_table.create({
            data: {
                id,
                topic_id,
                username,
                message,
                time
            }
        })
    } catch (error) {
        throw error;
    }
}

export const fetchComments = async (id: string) => {
    try {
        // return await db
        //     .select()
        //     .from(commentsTable)
        //     .where(eq(commentsTable.topic_id, id))

        return await prisma.comments_table.findMany({
            where: {
                topic_id: id
            }
        })
    } catch (error) {
        throw error;
    }
}