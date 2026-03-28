"use client";

import { useEffect, useState } from "react";
import {
  Shield, Users, Settings, Plus, Trash2, Search,
  BarChart3, Activity, AlertTriangle, CheckCircle2,
  Crown, Mail, Calendar, MoreHorizontal, UserCog, X
} from "lucide-react";
import Navbar from "../components/Navbar";
import { useRouter } from "next/navigation";
import { User, UserRole } from "../utils/type";
import { alterUserRole, fetchAllAdmins, fetchfilteredUsers, getAllUsersCount } from "../db/operations/users";
import { toast } from "sonner";
import { getTotalProblemCount } from "../db/operations/problems";
import { getTotalTutorialCount } from "../db/operations/tutorials";

// interface Admin {
//   id: string;
//   username: string;
//   email: string;
//   role: UserRole;
//   dateJoined: string;
// }

// const MOCK_ADMINS: User[] = [
//   { id: "1", username: "root_admin", email: "root@algocraft.dev", role: "super_admin", dateJoined: "Oct 2024" },
//   { id: "2", username: "mod_sarah", email: "sarah@algocraft.dev", role: "admin", dateJoined: "Dec 2024" },
//   { id: "3", username: "mod_jake", email: "jake@algocraft.dev", role: "professor", dateJoined: "Jan 2025" },
//   { id: "4", username: "mod_luna", email: "luna@algocraft.dev", role: "professor", dateJoined: "Feb 2025" },
// ];

type Stats = {
  totalUsers: number,
  tutorialsCreated: number,
  problemsCreated: number,
  totalofficials: number,
};

const ROLE_STYLES: Record<string, string> = {
  super_admin: "bg-orange-500/15 text-orange-500 border-orange-500/30",
  admin: "bg-blue-500/15 text-blue-500 border-blue-500/30",
  moderator: "bg-blue-600/15 text-blue-600 border-blue-600/30",
};

const APP_MANAGEMENT_SECTIONS = [
  { name: "Tutorial Management", path: "/admin/tutorial" },
  { name: "Create Visualisation", path: "/admin/visual" },
  { name: "Set Practice Problem", path: "/admin/problem" },
]

const AdminProfile = ({ user }: {
  user: {
    id: string, username: string, role: UserRole, email: string, dateJoined: Date
  }
}) => {

  // State list
  const [activeTab, setActiveTab] = useState<"dashboard" | "admins" | "app_management" | "settings">("dashboard");
  const [admins, setAdmins] = useState<User[]>([]);
  const [statusBar, setStatusBar] = useState<Stats>({totalofficials: 0, totalUsers: 0, problemsCreated: 0, tutorialsCreated: 0})
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const [newUser, setnewUser] = useState({ id: "", username: "", email: "", role: "admin" as UserRole, dateJoined: new Date(Date.now()) });

  const filteredUsers: User[] = isAddingAdmin ? [newUser] : admins;

  const router = useRouter();

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    const added: User = {
      ...newUser,
      dateJoined: new Date(Date.now())
    };
    setAdmins([...admins, added]);
    setnewUser({ id: "", username: "", email: "", role: "professor", dateJoined: new Date(Date.now()) });
    setShowAddModal(false);
  };

  const handleRemoveAdmin = (id: string) => {
    setAdmins(admins.filter((a) => a.id !== id));
  };

  const handleSearchCandidate = async () => {
    setIsAddingAdmin(true);

    if (!searchQuery) {
      toast("Search is Empty!");
      return;
    }

    const user = await fetchfilteredUsers(searchQuery);
    console.log(user)
    user ? setnewUser({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role as UserRole,
      dateJoined: user.dateJoined
    }) : setnewUser({ id: "", username: "", email: "", role: "professor", dateJoined: new Date(Date.now()) });
  }

  const handleRoleChange = async (id: string, role: UserRole) => {
    if (!id || !role) return;

    isAddingAdmin ? setnewUser({ ...newUser, role: role }) : setAdmins(admins.map((admin, _) => admin.id === id ? {...admin, role: role} : admin));
    await alterUserRole(id, role);
  }

  useEffect(() => {
    const fetchAdmins = async () => {

      const [users, problemCount, tutorialCount, totalUsers] = await Promise.all([
        fetchAllAdmins(), 
        getTotalProblemCount(), 
        getTotalTutorialCount(),
        getAllUsersCount()
      ])
      
      
      // console.log(users, problemCount, tutorialCount, totalUsers)
      if (!users) return;
      
      setStatusBar({
        totalUsers: totalUsers || 0,
        problemsCreated: problemCount || 0,
        tutorialsCreated: tutorialCount || 0,
        totalofficials: users.length
      })

      const formattedUsers: User[] = users.map((user: { id: any; username: any; email: any; role: string; dateJoined: string | number | Date; }) => ({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role as UserRole,
        dateJoined: new Date(user.dateJoined),
      })).filter((fetchedUsers: { id: string; }) => fetchedUsers.id !== user.id);

      setAdmins(formattedUsers);
    };

    fetchAdmins();
  }, []);

  console.log(statusBar)

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16 max-w-6xl">
        {/* Header */}
        <div className="rounded-xl border border-blue-500 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <div className="h-20 w-20 rounded-xl bg-blue-500 border-2 border-blue-400 flex items-center justify-center shrink-0">
              <Shield size={32} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold font-mono text-blue-500">Admin Panel</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/90 text-white text-xs font-semibold font-mono border border-blue-300">
                  {user.role[0].toUpperCase() + user.role.substring(1).replace("_", " ")}
                </span>
              </div>
              <p className="text-sm text-slate-600">Manage your platform, users, and admin team.</p>
              <div className="flex gap-4 mt-3 text-xs text-slate-600">
                <span className="flex items-center gap-1.5"><Crown size={13} className="text-orange-500" /> {user.role[0].toUpperCase() + user.role.substring(1).replace("_", " ")}</span>
                <span className="flex items-center gap-1.5"><Mail size={13} /> {user.email}</span>
                <span className="flex items-center gap-1.5"><Calendar size={13} /> Since {new Date(user.dateJoined).toLocaleString("default", { month: "short" })}{" "} {new Date(user.dateJoined).getFullYear()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-slate-500">
          {(["dashboard", "admins", "app_management", "settings"] as const)
            .filter((tab) => user.role !== "professor" || tab !== "admins")
            .map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${activeTab === tab
                  ? "text-blue-500 border-blue-500"
                  : "text-slate-600 border-transparent hover:text-blue-500 hover:border-blue-500"
                  }`}
              >
                {tab === "admins"
                  ? "Manage Admins"
                  : tab.replace("_", " ")}
              </button>
            ))}
        </div>

        {/* Dashboard */}
        {activeTab === "dashboard" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <DashStat icon={<Users size={18} />} label="Total Users" value={statusBar.totalUsers.toString()} color="text-blue-500" />
              <DashStat icon={<Activity size={18} />} label="Tutorials" value={statusBar.tutorialsCreated.toString()} color="text-accent" />
              <DashStat icon={<BarChart3 size={18} />} label="Problems" value={statusBar.problemsCreated.toString()} color="text-foreground" />
              <DashStat icon={<AlertTriangle size={18} />} label="Total Officials" value={statusBar.totalofficials.toString()} color="text-red-border-red-500" />
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
        {activeTab === "admins" && (user.role === "admin" || user.role === "super_admin") && (
          <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between">
              <div className="relative flex-1 max-w-xs">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter Email..."
                  className="w-full h-9 rounded-lg border border-slate-500 bg-secondary pl-9 pr-3 text-sm text-foreground placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <button
                onClick={handleSearchCandidate}
                className="h-9 px-4 rounded-lg bg-blue-500 text-white font-mono text-xs font-semibold hover:bg-blue-500/90 transition-colors flex items-center gap-2 shrink-0"
              >
                <Plus size={15} /> Search
              </button>
            </div>

            {/* Admin Table */}
            <div className="rounded-xl border border-slate-500 bg-card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-500">
                    <th className="text-left px-5 py-3 text-xs font-medium text-slate-600">User</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-slate-600 hidden md:table-cell">Role</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-slate-600 hidden lg:table-cell">Added</th>
                    {/* <th className="text-left px-5 py-3 text-xs font-medium text-slate-600 hidden sm:table-cell">Last Active</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-slate-600">Status</th> */}
                    <th className="text-left px-5 py-3 text-xs font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((admin, index) => (
                    <tr key={index} className="border-b border-slate-500 last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-3">
                        <div>
                          <p className="font-medium text-foreground font-mono">{admin.username}</p>
                          <p className="text-xs text-slate-600">{admin.email}</p>
                        </div>
                      </td>
                      <td className="px-5 py-3 hidden md:table-cell">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${ROLE_STYLES[admin.role]}`}>
                          {admin.role.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-slate-600 hidden lg:table-cell">{admin.dateJoined.toLocaleDateString()}</td>
                      <td>
                        {admin.role !== "super_admin" && (
                          <select
                            value={admin.role}
                            onChange={(e) => handleRoleChange(admin.id, e.target.value as UserRole)}
                            className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm 
                 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 
                 focus:border-blue-500 transition-all duration-200 
                 hover:border-gray-400 cursor-pointer"
                          >
                            <option value="">Select role</option>
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                            <option value="professor">Professor</option>
                          </select>
                        )}
                      </td>
                      {/* <td className="px-5 py-3 text-right">
                        {admin.role !== "super_admin" && !isAddingAdmin && (
                          <button
                            onClick={() => handleRemoveAdmin(admin.id)}
                            className="p-1.5 rounded-md text-slate-600 hover:text-red-border-red-500 hover:bg-red-border-red-500/10 transition-colors"
                            title="Remove admin"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </td> */}
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-5 py-10 text-center text-slate-600">
                        No admins found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* App Management  */}
        {activeTab === "app_management" && (
          <div className="flex gap-3 flex-wrap">
            {/* <button onClick={() => router.push(`/admin/tutorial?u=${user?.id}`)} className="px-4 py-2 h-32 w-43 rounded-lg border border-blue-500 bg-blue-500/70 text-white font-semibold hover:text-blue-500 transition-colors">
              Tutorial Management
            </button> */}

            {APP_MANAGEMENT_SECTIONS.map((section, index) => {
              return (
                <button key={index} onClick={() => router.push(`${section.path}?u=${user?.id}`)} className="px-4 py-2 h-32 w-43 rounded-lg border border-blue-500 bg-blue-500/70 text-white font-semibold hover:text-blue-500 transition-colors">
                  {section.name}
                </button>
              )
            })}
          </div>
        )}

        {/* Settings */}
        {activeTab === "settings" && (
          <div className="rounded-xl border border-blue-500 bg-white p-5 space-y-6">
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
                <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-600 hover:text-foreground transition-colors">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleAddAdmin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-foreground">Username</label>
                  <input
                    type="text"
                    required
                    value={newUser.username}
                    onChange={(e) => setnewUser({ ...newUser, username: e.target.value })}
                    placeholder="new_admin"
                    className="w-full h-10 rounded-lg border border-slate-500 bg-secondary px-3 text-sm text-foreground placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-foreground">Email</label>
                  <input
                    type="email"
                    required
                    value={newUser.email}
                    onChange={(e) => setnewUser({ ...newUser, email: e.target.value })}
                    placeholder="admin@algocraft.dev"
                    className="w-full h-10 rounded-lg border border-slate-500 bg-secondary px-3 text-sm text-foreground placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-foreground">Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setnewUser({ ...newUser, role: e.target.value as UserRole })}
                    className="w-full h-10 rounded-lg border border-slate-500 bg-secondary px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 h-10 rounded-lg border border-slate-500 bg-secondary text-sm text-foreground hover:bg-muted transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 h-10 rounded-lg bg-blue-500 text-blue-500-foreground font-mono text-sm font-semibold hover:bg-blue-500/90 transition-colors flex items-center justify-center gap-2">
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
    <p className="text-xs text-slate-600 mt-0.5">{label}</p>
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
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-slate-600">{description}</p>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="flex-1 h-9 rounded-lg border border-slate-500 bg-secondary px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      />
    </div>
  );
};

export default AdminProfile;
