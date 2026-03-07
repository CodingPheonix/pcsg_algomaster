"use server"

import { eq } from "drizzle-orm"
import { db } from ".."
import { Mixed, topicstable } from "../schema"

export const insertTopic = async ({ id, title, content, tutorial_id }: { id: string, title?: string, content?: Mixed[], tutorial_id: string }) => {
    try {
        await db
            .insert(topicstable)
            .values({
                id,
                title: title || 'Untitled',
                content: content || null,
                tutorial_id
            })
    } catch (error) {
        console.error("Error inserting topic:", error);
        throw error;
    }
}

export const fetchTopics = async (id: string) => {
    try {
        return await db
            .select()
            .from(topicstable)
            .where(eq(topicstable.id, id))

    } catch (error) {
        console.error("Error fetching topics:", error);
        throw error;
    }
}

export const addTopicContent = async ( topicId: string, title?: string | "untitled", content?: Mixed[] | []) => {
    try {
        await db
        .update(topicstable)
        .set({
            title: title,
            content: content
        })
        .where(eq(topicstable.id, topicId))
    } catch (error) {
        console.error("Error fetching topics:", error);
        throw error;
    }
}