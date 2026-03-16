'use server'

import { eq } from "drizzle-orm"
import { db } from ".."
import { setTable } from "../schema"


export const insertSet = async (id: string, name: string, author_id: string) => {
    try {
        await db
            .insert(setTable)
            .values({
                id,
                name,
                author_id
            })
    } catch (error) {
        console.error(error)
    }
}

export const deleteSetById = async (id: string) => {
    try {
        await db
            .delete(setTable)
            .where(eq(setTable.id, id))
    } catch (error) {
        console.error(error)
    }
}