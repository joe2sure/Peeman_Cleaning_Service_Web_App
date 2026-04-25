"use client";
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface UserPayload { id: string; firstName: string; lastName: string; email: string; role: string; }
interface AuthContextValue {
  user: UserPayload | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: { firstName: string; lastName: string; email: string; password: string; phone?: string }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const UserAuthContext = createContext<AuthContextValue | null>(null);

const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });

export function UserAuthProvider({ children }: { children: ReactNode }) {
  const [user,    setUser]    = useState<UserPayload | null>(null);
  const [token,   setToken]   = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const t = localStorage.getItem("peeman_user_token");
      const u = localStorage.getItem("peeman_user_data");
      if (t && u) { setToken(t); setUser(JSON.parse(u)); }
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  const persist = (t: string, u: UserPayload) => {
    localStorage.setItem("peeman_user_token", t);
    localStorage.setItem("peeman_user_data", JSON.stringify(u));
    setToken(t); setUser(u);
  };

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.post("/api/v1/users/login", { email, password });
    if (!res.data.success) throw new Error(res.data.message);
    persist(res.data.data.token, res.data.data.user);
    router.push("/");
  }, [router]);

  const signup = useCallback(async (data: { firstName: string; lastName: string; email: string; password: string; phone?: string }) => {
    const res = await api.post("/api/v1/users/signup", data);
    if (!res.data.success) throw new Error(res.data.message);
    persist(res.data.data.token, res.data.data.user);
    router.push("/");
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem("peeman_user_token");
    localStorage.removeItem("peeman_user_data");
    setToken(null); setUser(null);
    router.push("/");
  }, [router]);

  return (
    <UserAuthContext.Provider value={{ user, token, loading, login, signup, logout, isAuthenticated: !!token }}>
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth() {
  const ctx = useContext(UserAuthContext);
  if (!ctx) throw new Error("useUserAuth must be used within UserAuthProvider");
  return ctx;
}