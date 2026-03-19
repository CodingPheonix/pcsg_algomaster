'use server'

import { eq, inArray } from "drizzle-orm"
import { ne } from "drizzle-orm"
import { db } from ".."
import { usersTable } from "../schema"
import { UserRole } from "@/app/utils/type"


export const fetchfilteredUsers = async (email: string) => {
    try {
        return await db
        .select({
            id: usersTable.id,
            username: usersTable.username,
            email: usersTable.email,
            role: usersTable.role,
            dateJoined: usersTable.dateJoined
        })
        .from(usersTable)
        .where(eq(usersTable.email, email))
    } catch (error) {
        console.error(error)
    }
}

export const alterUserRole = async (userId: string, role: UserRole) => {
    try {
        await db
        .update(usersTable)
        .set({
            role: role
        })
        .where(eq(usersTable.id, userId))
    } catch (error) {
        console.log(error)
    }
}

export const fetchAllAdmins = async () => {
    try {
        return await db
        .select({
            id: usersTable.id,
            username: usersTable.username,
            email: usersTable.email,
            role: usersTable.role,
            dateJoined: usersTable.dateJoined
        })
        .from(usersTable)
        .where(inArray(usersTable.role, ["admin", "super_admin", "professor"]))
    } catch (error) {
        console.error(error)
    }
}