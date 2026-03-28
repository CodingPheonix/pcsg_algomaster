'use server'

import { eq, inArray } from "drizzle-orm"
import { ne } from "drizzle-orm"
import { db } from ".."
import { usersTable } from "../schema"
import { UserRole } from "@/app/utils/type"
import { prisma } from "../prisma"


export const fetchfilteredUsers = async (email: string) => {
    try {
        // return await db
        //     .select({
        //         id: usersTable.id,
        //         username: usersTable.username,
        //         email: usersTable.email,
        //         role: usersTable.role,
        //         dateJoined: usersTable.dateJoined
        //     })
        //     .from(usersTable)
        //     .where(eq(usersTable.email, email))

        const res = await prisma.users_table.findFirst({
            where: {
                email: email
            }
        })

        return res? {
            id: res.id,
            username: res.username,
            email: res.email,
            role: res.role,
            dateJoined: res.dateJoined
        } : null
    } catch (error) {
        console.error(error)
    }
}

export const alterUserRole = async (userId: string, role: UserRole) => {
    try {
        // await db
        //     .update(usersTable)
        //     .set({
        //         role: role
        //     })
        //     .where(eq(usersTable.id, userId))

        await prisma.users_table.update({
            where: {
                id: userId
            },
            data: {
                role
            }
        })
    } catch (error) {
        console.log(error)
    }
}

export const fetchAllAdmins = async () => {
    try {
        // return await db
        //     .select({
        //         id: usersTable.id,
        //         username: usersTable.username,
        //         email: usersTable.email,
        //         role: usersTable.role,
        //         dateJoined: usersTable.dateJoined
        //     })
        //     .from(usersTable)
        //     .where(inArray(usersTable.role, ["admin", "super_admin", "professor"]))

        const res = await prisma.users_table.findMany({
            where: {
                role: {
                    in: ["admin", "super_admin", "professor"]
                }
            }
        })

        return res.map((user: { id: any; username: any; email: any; role: any; dateJoined: any }) => {
            return {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                dateJoined: user.dateJoined
            }
        })
    } catch (error) {
        console.error(error)
    }
}

export const getAllUsersCount = async () => {
    try {
        // return await db
        //     .$count(usersTable)

        return await prisma.users_table.count()
    } catch (error) {
        console.error(error)
    }
}