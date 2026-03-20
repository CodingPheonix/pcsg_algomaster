export type UserRole = "user" | 'professor' | 'admin' | 'super_admin'

export type Difficulty = "Easy" | "Normal" | "Hard"

export type User = {
    id: string;
    username: string;
    email: string;
    role: UserRole;
    dateJoined: Date
}