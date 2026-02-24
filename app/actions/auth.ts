'use server'

import { SignupFormSchema, FormState } from "../lib/definations"
import bcrypt from 'bcrypt'
import { usersTable } from "../db/schema"
import { db } from "../db"
import { redirect } from "next/navigation"
import { createSession, deleteSession } from "../lib/sessions"
import { eq, or } from "drizzle-orm"

export async function signup(state: FormState, formData: FormData) {
    // Validate form fields
    const validatedFields = SignupFormSchema.safeParse({
        username: formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password'),
    })

    // If any form fields are invalid, return early
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    // 2. Prepare data for insertion into database
    const { username, email, password } = validatedFields.data
    // e.g. Hash the user's password before storing it
    const hashedPassword = await bcrypt.hash(password, 10)


    // check if user exists
    const existingUser = await db
        .select()
        .from(usersTable)
        .where(or(eq(usersTable.email, email), eq(usersTable.username, username)))
        .execute()

    if (existingUser.length > 0) {
        return {
            errors: {
                email: ['Email already exists.'],
                username: ['Username already exists.'],
            },
        }
    }

    //   3. Insert the user into the database or call an Auth Library's API
    const data = await db
        .insert(usersTable)
        .values({
            username,
            email,
            password: hashedPassword,
        })
        .$returningId()

    const user = data[0]

    if (!user) {
        return {
            message: 'An error occurred while creating your account.',
        }
    }

    // 4. Create user session
    await createSession(user.id as unknown as string)
    // 5. Redirect user
    redirect('/');
}

export async function logout() {
    await deleteSession();
    window.location.reload();
    redirect('/login')
}