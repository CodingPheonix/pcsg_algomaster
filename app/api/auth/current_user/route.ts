import { usersTable } from "@/app/db/schema";
import { db } from "../../../db/index";
import { decrypt } from "@/app/lib/sessions";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { Users } from "@/app/db/mongodb/mongo_schema";
import { prisma } from "@/app/db/prisma";

type sessionPayload = {
    userId: string,
    expiresAt: string
}

export async function GET(request: NextRequest) {
    try {
        const session = request.cookies.get('session')?.value
        if (!session) {
            return NextResponse.json({ user: null })
        }

        console.log('Session payload:', await decrypt(session as string))

        const decrypted = await decrypt(session as string) as sessionPayload

        // const data = await db
        //     .select()
        //     .from(usersTable)
        //     .where(eq(usersTable.id, decrypted.userId))
        //     .execute()

        const data = await prisma.users_table.findUnique({
            where: {
                id: decrypted.userId
            }
        })

        // const data = await Users.findOne({
        //     id: decrypted.userId
        // })

        console.log("fetched decrypt data" , data)

        return NextResponse.json({
            user: {
                id: data.id,
                username: data.username,
                email: data.email,
                role: data.role,
                dateJoined: data.dateJoined
            }
        })
    } catch (error) {
        return NextResponse.json({ user: null })
    }
}