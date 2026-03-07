"use client";

import { useState } from "react";
import {
  User, Mail, Calendar, Trophy, Flame, Code2, BookOpen,
  Settings, Edit3, Camera, BarChart3, Clock, CheckCircle2,
  Star, TrendingUp, Target
} from "lucide-react";
import Navbar from "../components/Navbar";
import { useUserContext } from "../context/userContext";

const MOCK_USER = {
  username: "algo_master",
  email: "user@example.com",
  avatar: null as string | null,
  joinedDate: "Jan 2025",
  bio: "Passionate about algorithms and competitive programming. Currently exploring graph theory and dynamic programming.",
  streak: 14,
  level: "Intermediate",
  xp: 2450,
  xpToNext: 3000,
  stats: {
    problemsSolved: 87,
    totalAttempts: 134,
    accuracy: 65,
    rank: 1243,
    topPercent: 12,
    avgTime: "8m 32s",
  },
  recentActivity: [
    { name: "Binary Search", category: "Searching", status: "solved", date: "2h ago" },
    { name: "Merge Sort", category: "Sorting", status: "solved", date: "1d ago" },
    { name: "Dijkstra's Algorithm", category: "Graphs", status: "attempted", date: "2d ago" },
    { name: "Knapsack Problem", category: "Dynamic Programming", status: "solved", date: "3d ago" },
    { name: "Red-Black Tree", category: "Trees", status: "attempted", date: "5d ago" },
  ],
  skills: [
    { name: "Arrays", progress: 90 },
    { name: "Sorting", progress: 75 },
    { name: "Graphs", progress: 45 },
    { name: "Dynamic Programming", progress: 30 },
    { name: "Trees", progress: 60 },
    { name: "Searching", progress: 85 },
  ],
  badges: ["🏆 First Solve", "🔥 7-Day Streak", "⚡ Speed Demon", "📚 Bookworm"],
};

const UserProfile = ({ user }: { user: any }) => {
  const [activeTab, setActiveTab] = useState<"overview" | "activity" | "skills">("overview");

  const u = MOCK_USER;
  const xpPercent = Math.round((u.xp / u.xpToNext) * 100);

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16 max-w-5xl">
        {/* Header Card */}
        <div className="rounded-xl border border-blue-500 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {/* Avatar */}
            <div className="relative group shrink-0">
              <div className="h-24 w-24 rounded-xl flex items-center justify-center text-3xl font-bold font-mono text-blue-500 border-2 border-blue-600">
                {user?.username[0].toUpperCase()}
              </div>
              <button className="absolute inset-0 rounded-xl bg-background/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Camera size={20} className="text-foreground" />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold font-mono text-foreground">{user?.username}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-primary/15 text-blue-500 text-xs font-semibold font-mono border border-primary/30">
                  {u.level}
                </span>
              </div>
              <p className="text-sm text-slate-600 mb-3 max-w-lg">{u.bio}</p>
              <div className="flex flex-wrap gap-4 text-xs text-slate-600">
                <span className="flex items-center gap-1.5"><Mail size={13} /> {u.email}</span>
                <span className="flex items-center gap-1.5"><Calendar size={13} /> Joined {u.joinedDate}</span>
                <span className="flex items-center gap-1.5 text-orange-400"><Flame size={13} /> {u.streak}-day streak</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 shrink-0">
              <button className="px-3 py-1.5 rounded-lg border border-slate-800 bg-secondary text-sm text-foreground hover:bg-muted transition-colors flex items-center gap-1.5">
                <Edit3 size={14} /> Edit
              </button>
              <button className="p-2 rounded-lg border border-slate-800 bg-secondary text-slate-600 hover:text-foreground hover:bg-muted transition-colors">
                <Settings size={16} />
              </button>
            </div>
          </div>

          {/* XP Bar */}
          <div className="mt-5 pt-5 border-t border-slate-800">
            <div className="flex justify-between text-xs text-slate-600 mb-1.5 font-mono">
              <span>Level Progress</span>
              <span>{u.xp} / {u.xpToNext} XP</span>
            </div>
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${xpPercent}%` }} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-slate-800">
          {(["overview", "activity", "skills"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? "text-blue-500 border-primary"
                  : "text-slate-600 border-transparent hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Stats Cards */}
            <StatCard icon={<CheckCircle2 size={18} />} label="Problems Solved" value={u.stats.problemsSolved} sub={`${u.stats.accuracy}% accuracy`} />
            <StatCard icon={<TrendingUp size={18} />} label="Global Rank" value={`#${u.stats.rank}`} sub={`Top ${u.stats.topPercent}%`} />
            <StatCard icon={<Clock size={18} />} label="Avg. Solve Time" value={u.stats.avgTime} sub={`${u.stats.totalAttempts} attempts`} />

            {/* Badges */}
            <div className="md:col-span-3 rounded-xl border border-slate-800 bg-card p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Star size={15} className="text-streak" /> Badges
              </h3>
              <div className="flex flex-wrap gap-2">
                {u.badges.map((b) => (
                  <span key={b} className="px-3 py-1.5 rounded-lg bg-secondary border border-slate-800 text-sm text-foreground">
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "activity" && (
          <div className="rounded-xl border border-slate-800 bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-600">Problem</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-600 hidden sm:table-cell">Category</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-600">Status</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-slate-600">When</th>
                </tr>
              </thead>
              <tbody>
                {u.recentActivity.map((a, i) => (
                  <tr key={i} className="border-b border-slate-800 last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3 font-medium text-foreground">{a.name}</td>
                    <td className="px-5 py-3 text-slate-600 hidden sm:table-cell">{a.category}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        a.status === "solved"
                          ? "bg-primary/15 text-blue-500"
                          : "bg-streak/15 text-streak"
                      }`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right text-slate-600">{a.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "skills" && (
          <div className="rounded-xl border border-slate-800 bg-card p-5 space-y-4">
            {u.skills.map((s) => (
              <div key={s.name}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-foreground">{s.name}</span>
                  <span className="text-slate-600 font-mono text-xs">{s.progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full bg-blue-500 transition-all"
                    style={{ width: `${s.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string | number; sub: string }) => (
  <div className="rounded-xl border border-slate-800 bg-card p-5">
    <div className="flex items-center gap-2 text-slate-600 mb-2">{icon}<span className="text-xs font-medium">{label}</span></div>
    <p className="text-2xl font-bold font-mono text-foreground">{value}</p>
    <p className="text-xs text-slate-600 mt-0.5">{sub}</p>
  </div>
);

export default UserProfile;
