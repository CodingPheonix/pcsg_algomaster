'use client'

import { useState } from "react";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import { signup } from "../actions/auth";

const Signup = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [state, action, pending] = useActionState(signup, undefined);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4 bg-black text-white">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg  bg-green-500 text-black font-mono text-sm font-bold text-primary-foreground">
                            {"</>"}
                        </div>
                        <span className="font-mono text-lg font-bold text-foreground hidden sm:block">
                            Algo<span className="text-green-500">Craft</span>
                        </span>
                    </Link>
                    <h1 className="text-2xl font-bold text-foreground font-mono">Create Account</h1>
                    <p className="text-muted-foreground text-sm mt-1">Join the community and start learning</p>
                </div>

                <form action={action} className="rounded-xl border border-slate-800 bg-card p-6 space-y-5 bg-gray-900">
                    <div className="space-y-1.5">
                        <label htmlFor="username" className="block text-sm font-medium text-foreground">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="your_username"
                            required
                            className="w-full h-10 rounded-lg bg-slate-800 px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary transition-all"
                        />
                        {state?.errors?.username && <p>{state.errors.username}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="email" className="block text-sm font-medium text-foreground">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                            className="w-full h-10 rounded-lg bg-slate-800 px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary transition-all"
                        />
                        {state?.errors?.email && <p>{state.errors.email}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="password" className="block text-sm font-medium text-foreground">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="w-full h-10 rounded-lg bg-slate-800 px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary transition-all"
                        />
                        {state?.errors?.password && (
                            <div>
                                <p>Password must:</p>
                                <ul>
                                    {state.errors.password.map((error: string) => (
                                        <li key={error}>- {error}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={pending}
                        className="w-full h-10 rounded-lg bg-green-500 text-black font-mono text-sm font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                    >
                        <UserPlus size={16} />
                        Sign Up
                    </button>

                    <p className="text-center text-sm text-slate-500">
                        Already have an account?{" "}
                        <Link href="/login" className="text-green-500 hover:underline font-medium">
                            Sign In
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Signup;
function useActionState(signup: any, undefined: undefined): [any, any, any] {
    throw new Error("Function not implemented.");
}

