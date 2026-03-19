'use client'

import React, { useContext, createContext, useState, useEffect } from 'react'
import { UserRole, User } from '../utils/type';

type UserContextType = {
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>;
}

const UserContext = createContext<UserContextType | null>(null);

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUserContext must be used inside UserProvider");
    }
    return context;
};

const UserProvider = ({ children }: { children: React.ReactNode }) => {

    const [user, setUser] = useState<User>({
        id: "",
        username: "",
        email: "",
        role: "user",
        dateJoined: new Date(Date.now())
    });

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await fetch('/api/auth/current_user', {
                    credentials: 'include',
                });

                if (!response.ok) throw new Error();

                const userData = await response.json();

                console.log('Fetched user data:', userData);

                setUser({
                    id: userData.user.id,
                    username: userData.user.username,
                    email: userData.user.email,
                    role: userData.user.role,
                    dateJoined: userData.user.dateJoined
                });

            } catch {
                setUser({ id: "", username: "", role: "user", email: "", dateJoined: new Date(Date.now()) });
            }
        };

        fetchCurrentUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;