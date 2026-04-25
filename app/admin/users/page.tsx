"use client";
import { useEffect, useState, useCallback } from "react";
import adminApi from "@/lib/admin/api";
import type { UserProfile } from "@/types";
import { AdminTable, StatusBadge } from "@/components/admin/AdminTable";
import { Shield, ShieldOff, Trash2, ChevronLeft, ChevronRight, UserCheck, Users, UserX } from "lucide-react";

interface UserStats { total: number; active: number; inactive: number; admins: number; newLastWeek: number; }

export default function AdminUsersPage() {
  const [users,   setUsers]   = useState<UserProfile[]>([]);
  const [stats,   setStats]   = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [page,    setPage]    = useState(1);
  const [total,   setTotal]   = useState(0);
  const limit = 20;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [uRes, sRes] = await Promise.all([
        adminApi.get("/api/v1/users", { params: { page, limit } }),
        adminApi.get("/api/v1/users/stats"),
      ]);
      setUsers(uRes.data?.data ?? []);
      setTotal(uRes.data?.pagination?.total ?? 0);
      setStats(sRes.data?.data ?? null);
    } catch { setUsers([]); }
    finally { setLoading(false); }
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const toggleStatus = async (user: UserProfile) => {
    try {
      await adminApi.patch(`/api/v1/users/${user.id}/status`, { isActive: !user.isActive });
      setUsers(p => p.map(u => u.id === user.id ? { ...u, isActive: !user.isActive } : u));
    } catch { /* silent */ }
  };

  const toggleRole = async (user: UserProfile) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    if (!confirm(`Change ${user.firstName}'s role to ${newRole}?`)) return;
    try {
      await adminApi.patch(`/api/v1/users/${user.id}/role`, { role: newRole });
      setUsers(p => p.map(u => u.id === user.id ? { ...u, role: newRole } : u));
    } catch { /* silent */ }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this user permanently?")) return;
    try {
      await adminApi.delete(`/api/v1/users/${id}`);
      setUsers(p => p.filter(u => u.id !== id));
    } catch { /* silent */ }
  };

  const pages = Math.ceil(total / limit);
  const cols = [
    { key: "name",    label: "Name" },
    { key: "email",   label: "Email" },
    { key: "role",    label: "Role" },
    { key: "status",  label: "Status" },
    { key: "logins",  label: "Logins" },
    { key: "joined",  label: "Joined" },
    { key: "actions", label: "Actions" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-pine">Users</h1>
        <p className="text-brand-muted text-sm mt-0.5">Manage registered accounts and permissions.</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Users",    value: stats.total,       icon: Users },
            { label: "Active",         value: stats.active,      icon: UserCheck },
            { label: "Inactive",       value: stats.inactive,    icon: UserX },
            { label: "New This Week",  value: stats.newLastWeek, icon: Users },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-white border border-cream-mid rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-brand-muted uppercase tracking-wider">{label}</p>
                <Icon size={14} className="text-pine-light" />
              </div>
              <p className="font-serif text-2xl font-semibold text-pine">{value}</p>
            </div>
          ))}
        </div>
      )}

      <AdminTable columns={cols} loading={loading} emptyMessage="No users registered yet.">
        {users.map(u => (
          <tr key={u.id} className="hover:bg-cream/40 transition-colors">
            <td className="px-4 py-3 font-medium text-ink whitespace-nowrap">
              {u.firstName} {u.lastName}
            </td>
            <td className="px-4 py-3 text-brand-muted text-sm">{u.email}</td>
            <td className="px-4 py-3">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                u.role === "admin" ? "bg-gold/15 text-yellow-700" : "bg-sage-pale text-pine-mid"
              }`}>{u.role}</span>
            </td>
            <td className="px-4 py-3">
              <StatusBadge status={u.isActive ? "active" : "inactive"} />
            </td>
            <td className="px-4 py-3 text-brand-muted text-sm">{u.loginCount}</td>
            <td className="px-4 py-3 text-brand-muted text-sm whitespace-nowrap">
              {new Date(u.createdAt).toLocaleDateString("en-GB")}
            </td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-1.5">
                <button onClick={() => toggleStatus(u)} title={u.isActive ? "Deactivate" : "Activate"}
                  className={`p-1.5 rounded transition-colors ${u.isActive ? "text-pine-light hover:text-pine" : "text-brand-muted hover:text-pine-light"}`}>
                  {u.isActive ? <UserCheck size={13} /> : <UserX size={13} />}
                </button>
                <button onClick={() => toggleRole(u)} title={u.role === "admin" ? "Remove admin" : "Make admin"}
                  className={`p-1.5 rounded transition-colors ${u.role === "admin" ? "text-gold hover:text-yellow-700" : "text-brand-muted hover:text-gold"}`}>
                  {u.role === "admin" ? <ShieldOff size={13} /> : <Shield size={13} />}
                </button>
                <button onClick={() => remove(u.id)} title="Delete user"
                  className="p-1.5 text-brand-muted hover:text-red-500 transition-colors">
                  <Trash2 size={13} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </AdminTable>

      {pages > 1 && (
        <div className="flex items-center gap-3 justify-end">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="p-1.5 rounded border border-cream-mid hover:border-pine/30 disabled:opacity-40">
            <ChevronLeft size={14} />
          </button>
          <span className="text-sm text-brand-muted">Page {page} of {pages}</span>
          <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
            className="p-1.5 rounded border border-cream-mid hover:border-pine/30 disabled:opacity-40">
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}