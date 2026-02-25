"use client";

import { useState } from "react";
import {
  Shield, Users, Settings, Plus, Trash2, Search,
  BarChart3, Activity, AlertTriangle, CheckCircle2,
  Crown, Mail, Calendar, MoreHorizontal, UserCog, X
} from "lucide-react";
import Navbar from "../components/Navbar";

interface Admin {
  id: string;
  username: string;
  email: string;
  role: "super_admin" | "admin" | "moderator";
  addedDate: string;
  lastActive: string;
  status: "active" | "inactive";
}

const MOCK_ADMINS: Admin[] = [
  { id: "1", username: "root_admin", email: "root@algocraft.dev", role: "super_admin", addedDate: "Oct 2024", lastActive: "Just now", status: "active" },
  { id: "2", username: "mod_sarah", email: "sarah@algocraft.dev", role: "admin", addedDate: "Dec 2024", lastActive: "2h ago", status: "active" },
  { id: "3", username: "mod_jake", email: "jake@algocraft.dev", role: "moderator", addedDate: "Jan 2025", lastActive: "1d ago", status: "active" },
  { id: "4", username: "mod_luna", email: "luna@algocraft.dev", role: "moderator", addedDate: "Feb 2025", lastActive: "5d ago", status: "inactive" },
];

const MOCK_STATS = {
  totalUsers: 4821,
  activeToday: 342,
  problemsCreated: 156,
  reportsOpen: 7,
};

const ROLE_STYLES: Record<string, string> = {
  super_admin: "bg-orange-500/15 text-orange-500 border-orange-500/30",
  admin: "bg-green-500/15 text-green-500 border-green-500/30",
  moderator: "bg-green-600/15 text-green-600 border-green-600/30",
};

const AdminProfile = ({ user }: { user: any }) => {
  const [activeTab, setActiveTab] = useState<"dashboard" | "admins" | "settings">("dashboard");
  const [admins, setAdmins] = useState(MOCK_ADMINS);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ username: "", email: "", role: "moderator" as Admin["role"] });

  const filteredAdmins = admins.filter(
    (a) => a.username.toLowerCase().includes(searchQuery.toLowerCase()) || a.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    const added: Admin = {
      id: Date.now().toString(),
      ...newAdmin,
      addedDate: "Just now",
      lastActive: "Never",
      status: "active",
    };
    setAdmins([...admins, added]);
    setNewAdmin({ username: "", email: "", role: "moderator" });
    setShowAddModal(false);
  };

  const handleRemoveAdmin = (id: string) => {
    setAdmins(admins.filter((a) => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16 max-w-6xl">
        {/* Header */}
        <div className="rounded-xl border border-slate-500 bg-[#131314] p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <div className="h-20 w-20 rounded-xl bg-[#705d48] border-2 border-[#916a26] flex items-center justify-center shrink-0">
              <Shield size={32} className="text-orange-500" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold font-mono text-foreground">Admin Panel</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-orange-500/15 text-orange-300 text-xs font-semibold font-mono border border-orange-300">
                  Super Admin
                </span>
              </div>
              <p className="text-sm text-slate-400">Manage your platform, users, and admin team.</p>
              <div className="flex gap-4 mt-3 text-xs text-slate-400">
                <span className="flex items-center gap-1.5"><Crown size={13} className="text-orange-500" /> root_admin</span>
                <span className="flex items-center gap-1.5"><Mail size={13} /> root@algocraft.dev</span>
                <span className="flex items-center gap-1.5"><Calendar size={13} /> Since Oct 2024</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-slate-500">
          {(["dashboard", "admins", "settings"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? "text-green-500 border-green-500"
                  : "text-slate-400 border-transparent hover:text-green-500 hover:border-green-500"
              }`}
            >
              {tab === "admins" ? "Manage Admins" : tab}
            </button>
          ))}
        </div>

        {/* Dashboard */}
        {activeTab === "dashboard" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <DashStat icon={<Users size={18} />} label="Total Users" value={MOCK_STATS.totalUsers.toLocaleString()} color="text-green-500" />
              <DashStat icon={<Activity size={18} />} label="Active Today" value={MOCK_STATS.activeToday.toString()} color="text-accent" />
              <DashStat icon={<BarChart3 size={18} />} label="Problems" value={MOCK_STATS.problemsCreated.toString()} color="text-foreground" />
              <DashStat icon={<AlertTriangle size={18} />} label="Open Reports" value={MOCK_STATS.reportsOpen.toString()} color="text-red-border-red-500" />
            </div>

            <div className="rounded-xl border border-slate-500 bg-card p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <QuickAction icon={<UserCog size={16} />} label="Manage Users" />
                <QuickAction icon={<BarChart3 size={16} />} label="View Analytics" />
                <QuickAction icon={<AlertTriangle size={16} />} label="Review Reports" />
              </div>
            </div>
          </div>
        )}

        {/* Manage Admins */}
        {activeTab === "admins" && (
          <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between">
              <div className="relative flex-1 max-w-xs">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search admins..."
                  className="w-full h-9 rounded-lg border border-slate-500 bg-secondary pl-9 pr-3 text-sm text-foreground placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-green-500 transition-all"
                />
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="h-9 px-4 rounded-lg bg-green-500 text-black font-mono text-xs font-semibold hover:bg-green-500/90 transition-colors flex items-center gap-2 shrink-0"
              >
                <Plus size={15} /> Add Admin
              </button>
            </div>

            {/* Admin Table */}
            <div className="rounded-xl border border-slate-500 bg-card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-500">
                    <th className="text-left px-5 py-3 text-xs font-medium text-slate-400">User</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-slate-400 hidden md:table-cell">Role</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-slate-400 hidden lg:table-cell">Added</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-slate-400 hidden sm:table-cell">Last Active</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-slate-400">Status</th>
                    <th className="text-right px-5 py-3 text-xs font-medium text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdmins.map((admin) => (
                    <tr key={admin.id} className="border-b border-slate-500 last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-3">
                        <div>
                          <p className="font-medium text-foreground font-mono">{admin.username}</p>
                          <p className="text-xs text-slate-400">{admin.email}</p>
                        </div>
                      </td>
                      <td className="px-5 py-3 hidden md:table-cell">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${ROLE_STYLES[admin.role]}`}>
                          {admin.role.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-slate-400 hidden lg:table-cell">{admin.addedDate}</td>
                      <td className="px-5 py-3 text-slate-400 hidden sm:table-cell">{admin.lastActive}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1 text-xs font-medium ${
                          admin.status === "active" ? "text-green-500" : "text-slate-400"
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${admin.status === "active" ? "bg-green-500" : "bg-slate-400text-slate-400"}`} />
                          {admin.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        {admin.role !== "super_admin" && (
                          <button
                            onClick={() => handleRemoveAdmin(admin.id)}
                            className="p-1.5 rounded-md text-slate-400 hover:text-red-border-red-500 hover:bg-red-border-red-500/10 transition-colors"
                            title="Remove admin"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredAdmins.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-5 py-10 text-center text-slate-400">
                        No admins found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Settings */}
        {activeTab === "settings" && (
          <div className="rounded-xl border border-slate-500 bg-slate-950 p-5 space-y-6">
            <SettingRow label="Platform Name" description="The public name of your platform" defaultValue="AlgoCraft" />
            <SettingRow label="Support Email" description="Where user reports are sent" defaultValue="support@algocraft.dev" />
            <SettingRow label="Max Daily Submissions" description="Limit per user per day" defaultValue="50" />
            <div className="pt-4 border-t border-slate-500">
              <h3 className="text-sm font-semibold text-foreground mb-3">Danger Zone</h3>
              <div className="flex flex-wrap gap-3">
                <button className="px-4 py-2 rounded-lg border border-red-500/30 text-red-500 text-sm hover:bg-red-500/10 transition-colors">
                  Reset All User Data
                </button>
                <button className="px-4 py-2 rounded-lg border border-red-500/30 text-red-500 text-sm hover:bg-red-500/10 transition-colors">
                  Purge Inactive Accounts
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Admin Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-xl border border-slate-500 bg-card p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold font-mono text-foreground">Add New Admin</h2>
                <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-foreground transition-colors">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleAddAdmin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-foreground">Username</label>
                  <input
                    type="text"
                    required
                    value={newAdmin.username}
                    onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
                    placeholder="new_admin"
                    className="w-full h-10 rounded-lg border border-slate-500 bg-secondary px-3 text-sm text-foreground placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-foreground">Email</label>
                  <input
                    type="email"
                    required
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                    placeholder="admin@algocraft.dev"
                    className="w-full h-10 rounded-lg border border-slate-500 bg-secondary px-3 text-sm text-foreground placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-foreground">Role</label>
                  <select
                    value={newAdmin.role}
                    onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value as Admin["role"] })}
                    className="w-full h-10 rounded-lg border border-slate-500 bg-secondary px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  >
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 h-10 rounded-lg border border-slate-500 bg-secondary text-sm text-foreground hover:bg-muted transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 h-10 rounded-lg bg-green-500 text-green-500-foreground font-mono text-sm font-semibold hover:bg-green-500/90 transition-colors flex items-center justify-center gap-2">
                    <Plus size={15} /> Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const DashStat = ({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) => (
  <div className="rounded-xl border border-slate-500 bg-card p-5">
    <div className={`mb-2 ${color}`}>{icon}</div>
    <p className="text-2xl font-bold font-mono text-foreground">{value}</p>
    <p className="text-xs text-slate-400 mt-0.5">{label}</p>
  </div>
);

const QuickAction = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <button className="flex items-center gap-2.5 px-4 py-3 rounded-lg border border-slate-500 bg-secondary hover:bg-muted text-sm font-medium text-foreground transition-colors">
    {icon} {label}
  </button>
);

const SettingRow = ({ label, description, defaultValue }: { label: string; description: string; defaultValue: string }) => {
  const [value, setValue] = useState(defaultValue);
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
      <div className="sm:w-48 shrink-0">
        <p className="text-sm font-medium text-slate-100">{label}</p>
        <p className="text-xs text-slate-400">{description}</p>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="flex-1 h-9 rounded-lg border border-slate-500 bg-secondary px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-green-500 transition-all"
      />
    </div>
  );
};

export default AdminProfile;
