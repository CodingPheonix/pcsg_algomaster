import { SignupFormSchema, FormState } from "../lib/definations"
import bcrypt from 'bcrypt'
import { usersTable } from "../db/schema"
import { db } from "../db"

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
}