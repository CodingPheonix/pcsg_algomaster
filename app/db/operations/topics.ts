"use server"

import { eq, inArray } from "drizzle-orm"
import { db } from ".."
import { algoVisualsTable, commentsTable, Mixed, subtopicTable, topicstable, tutorialsTable, tutorialSubtopicsTable } from "../schema"
import { prisma } from "../prisma"

export const insertTopic = async ({ id, title, content, tutorial_id }: { id: string, title?: string, content?: Mixed[], tutorial_id: string }) => {
    try {
        // await db
        //     .insert(topicstable)
        //     .values({
        //         id,
        //         title: title || 'Untitled',
        //         content: content || null,
        //         tutorial_id
        //     })

        await prisma.topics_table.create({
            data: {
                id,
                title: title || 'Untitled',
                content: content?.toString() || null,
                tutorial_id
            }
        })
    } catch (error) {
        console.error("Error inserting topic:", error);
        throw error;
    }
}

export const fetchTopics = async (id: string) => {
    try {
        // return await db
        //     .select()
        //     .from(topicstable)
        //     .where(eq(topicstable.id, id))

        return await prisma.topics_table.findMany({
            where: {
                id
            }
        })

    } catch (error) {
        console.error("Error fetching topics:", error);
        throw error;
    }
}

export const editTopic = async (id: string, value: string) => {
    console.log("enter", id, value)
    try {
        // await db
        //     .update(topicstable)
        //     .set({
        //         title: value
        //     })
        //     .where(eq(topicstable.id, id))

        await prisma.topics_table.update({
            data: {
                title: value
            },
            where: {
                id
            }
        })
    } catch (error) {
        console.error(error)
    }
}

export const addTopicContent = async (topicId: string, title?: string | "untitled", content?: Mixed[] | []) => {
    try {
        // await db
        //     .update(topicstable)
        //     .set({
        //         title: title,
        //         content: content
        //     })
        //     .where(eq(topicstable.id, topicId))

        await prisma.topics_table.update({
            data: {
                title: title,
                content: content?.toString()
            },
            where: {
                id: topicId
            }
        })
    } catch (error) {
        console.error("Error fetching topics:", error);
        throw error;
    }
}

export const deleteTopic = async (topicId: string) => {
    // const subtopics = await db
    //     .select({ subtopicId: tutorialSubtopicsTable.subtopicId })
    //     .from(tutorialSubtopicsTable)
    //     .where(eq(tutorialSubtopicsTable.tutorialId, topicId));
    const subtopics = await prisma.subtopic_table.findMany({
        where: {
            tutorial_id: topicId
        }
    })

    const subtopicIds = subtopics.map(s => s.id);

    if (subtopicIds.length > 0) {
        // await db
        //     .delete(algoVisualsTable)
        //     .where(inArray(algoVisualsTable.subtopic_id, subtopicIds));

        await prisma.algovisuals_table.deleteMany({
            where: {
                subtopic_id: {
                    in: subtopicIds
                }
            }
        })
    }

    // await db
    //     .delete(tutorialSubtopicsTable)
    //     .where(eq(tutorialSubtopicsTable.tutorialId, topicId));


    if (subtopicIds.length > 0) {
        // await db
        //     .delete(subtopicTable)
        //     .where(inArray(subtopicTable.id, subtopicIds));

        await prisma.subtopic_table.deleteMany({
            where: {
                id: {
                    in: subtopicIds
                }
            }
        })
    }

    // const topics = await db
    //     .select({ id: topicstable.id })
    //     .from(topicstable)
    //     .where(eq(topicstable.tutorial_id, topicId));

    const topics = await prisma.topics_table.findMany({
        where: {
            tutorial_id: topicId
        }
    })

    const topicIds = topics.map(t => t.id);

    if (topicIds.length > 0) {
        // await db
        //     .delete(commentsTable)
        //     .where(inArray(commentsTable.topic_id, topicIds));

        await prisma.comments_table.deleteMany({
            where: {
                topic_id: {
                    in: topicIds
                }
            }
        })
    }

    // await db
    //     .delete(topicstable)
    //     .where(eq(topicstable.tutorial_id, topicId));

    await prisma.topics_table.deleteMany({
        where: {
            tutorial_id: topicId
        }
    })

    // await db
    //     .delete(tutorialsTable)
    //     .where(eq(tutorialsTable.id, topicId));

    await prisma.tutorials_table.delete({
        where: {
            id: topicId
        }
    })
};