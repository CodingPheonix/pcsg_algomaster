'use client';

import { Search, Flame, Youtube, Globe, LogIn, UserPlus } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useUserContext } from "../context/userContext";
import { logout } from "../actions/auth";
import { useRouter } from "next/navigation";

const Navbar = () => {
    const [searchOpen, setSearchOpen] = useState(false);

    const router = useRouter()
    const UserContext = useUserContext()
    const user = UserContext?.user
    const setUser = UserContext?.setUser

    console.log(user)

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-black/80 text-white backdrop-blur-xl">
            <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
                <Link href="/" className="flex items-center gap-2 shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500 text-black font-mono text-sm font-bold text-primary-foreground">
                        {"</>"}
                    </div>
                    <span className="font-mono text-lg font-bold text-foreground hidden sm:block">
                        Algo<span className="text-green-500">Craft</span>
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-1">
                    <NavItem label="Algorithms" />
                    <NavItem label="Data Structures" />
                    <NavItem label="Resources" />
                </div>

                <div className="flex items-center gap-2">
                    <div className={`relative transition-all duration-300 ${searchOpen ? "w-48 lg:w-64" : "w-9"}`}>
                        <button
                            onClick={() => setSearchOpen(!searchOpen)}
                            className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors z-10"
                        >
                            <Search size={16} />
                        </button>
                        <input
                            type="text"
                            placeholder="Search topics..."
                            className={`h-9 w-full rounded-lg border border-border bg-secondary pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary transition-all ${searchOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                        />
                    </div>

                    <a href="#" className="p-2 text-muted-foreground hover:text-destructive transition-colors hover:text-red-500" title="YouTube">
                        <Youtube size={18} />
                    </a>
                    <a href="#" className="p-2 text-muted-foreground hover:text-primary transition-colors hover:text-blue-500" title="Website">
                        <Globe size={18} />
                    </a>

                    <button className="px-2 py-1 text-streak hover:scale-110 transition-transform flex gap-2 justify-center items-center border-2 border-amber-500 text-amber-500 rounded-2xl" title="Streak">
                        <Flame size={18} />
                        0
                    </button>

                    {user?.username !== "" ? (
                        <div className="flex items-center gap-3">

                            {/* Avatar */}
                            <div className="w-9 h-9 flex items-center justify-center rounded-full bg-linear-to-br from-emerald-500 to-green-600 text-white font-semibold text-sm shadow-sm">
                                {user?.username?.charAt(0)?.toUpperCase() || "U"}
                            </div>

                            {/* Username + Logout */}
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-700">
                                    {user?.username}
                                </span>
                                <button
                                    onClick={() => {logout(); setUser && setUser({ username: "", id: "", role: "user" })}}
                                    className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-300">
                                    Logout
                                </button>

                            </div>

                        </div>
                    ) : (
                        <div className="flex">
                            <button onClick={() => { router.push('/login') }} className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                                <LogIn size={15} />
                                Sign In
                            </button>
                            <button onClick={() => { router.push('/signup') }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground font-mono text-xs font-medium hover:bg-primary/90 transition-colors">
                                <UserPlus size={15} />
                                <span className="hidden sm:inline">Register</span>
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </nav>
    );
};

const NavItem = ({ label }: { label: string }) => (
    <a
        href="#"
        className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors rounded-md hover:bg-secondary"
    >
        {label}
    </a>
);

export default Navbar;
