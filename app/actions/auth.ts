'use server'

import { SignupFormSchema, FormState, LoginFormSchema } from "../lib/definations"
import bcrypt from 'bcrypt'
import { usersTable } from "../db/schema"
import { db } from "../db"
import { redirect } from "next/navigation"
import { createSession, deleteSession } from "../lib/sessions"
import { eq, or } from "drizzle-orm"
import { v4 as uuidv4 } from "uuid"

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

    const userId = uuidv4();

    //   3. Insert the user into the database or call an Auth Library's API
    try {
        await db
            .insert(usersTable)
            .values({
                id: userId,
                username,
                email,
                password: hashedPassword,
            })
            .$returningId()
    } catch (error) {
        return {
            message: 'An error occurred while creating your account.',
        }
    }

    // 4. Create user session
    await createSession(userId)
    // 5. Redirect user
    redirect('/');
}

export async function login(state: FormState, formData: FormData) {
    // Validate form fields
    const validatedFields = LoginFormSchema.safeParse({
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
    const { email, password } = validatedFields.data
    // e.g. Hash the user's password before storing it
    const hashedPassword = await bcrypt.hash(password, 10)


    // check if user exists
    const existingUser = await db
        .select()
        .from(usersTable)
        .where(or(eq(usersTable.email, email), eq(usersTable.password, hashedPassword)))
        .execute()

    console.log('Existing user:', existingUser)

    if (existingUser.length === 0) {
        return {
            errors: {
                email: ['Email does not exist.'],
            },
        }
    }

    // 4. Create user session
    await createSession(existingUser[0].id as unknown as string)
    // 5. Redirect user
    redirect('/');
}

export async function logout() {
    await deleteSession();
    redirect('/login')
}