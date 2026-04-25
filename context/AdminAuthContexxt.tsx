"use client";
import {
  createContext, useContext, useState, useEffect, useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { adminLogin } from "@/lib/admin/api";
import type { AdminUser } from "@/types";

interface AuthContextValue {
  user: AdminUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]   = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Rehydrate from localStorage on mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("peeman_admin_token");
      const storedUser  = localStorage.getItem("peeman_admin_user");
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser) as AdminUser);
      }
    } catch {
      /* corrupt storage — ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await adminLogin(email, password);
    if (!res.success) throw new Error(res.message || "Login failed");

    const { token: newToken, user: newUser } = res.data as { token: string; user: AdminUser };
    localStorage.setItem("peeman_admin_token", newToken);
    localStorage.setItem("peeman_admin_user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    router.push("/admin");
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem("peeman_admin_token");
    localStorage.removeItem("peeman_admin_user");
    setToken(null);
    setUser(null);
    router.push("/admin/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, logout, isAuthenticated: !!token }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  return ctx;
}
