import { usersTable } from "@/app/db/schema";
import { db } from "../../../db/index";
import { decrypt } from "@/app/lib/sessions";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

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

        const data = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.id, decrypted.userId))
            .execute()

        return NextResponse.json({
            user: {
                id: data[0].id,
                username: data[0].username,
                email: data[0].email,
                role: data[0].role,
                dateJoined: data[0].dateJoined
            }
        })
    } catch (error) {
        return NextResponse.json({ user: null })
    }
}