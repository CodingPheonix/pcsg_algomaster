"use client";

import { useUserContext } from '../context/userContext'
import AdminProfile from './AdminProfile'
import UserProfile from './UserProfile'

const page = () => {

    const UserContext = useUserContext()
    const user = UserContext?.user

    console.log("Profile Page Rendered, User:", user)

    return (
        <div>
            {user.id !== "" && (user?.role === "admin" ? <AdminProfile user={user} /> : <UserProfile user={user} />)}
        </div>
    )
}

export default page
