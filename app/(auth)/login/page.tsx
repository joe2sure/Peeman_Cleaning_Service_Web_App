"use client";
import { useState, FormEvent, useEffect } from "react";
import Link from "next/link";
import { useUserAuth } from "@/context/UserAuthContext";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
// import { useRouter } from "next/router";

export default function LoginPage() {
  const { login, isAuthenticated } = useUserAuth();
  const router = useRouter();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Both fields are required."); return; }
    setLoading(true); setError("");
    try {
      await login(email.trim(), password);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid email or password");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 pt-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <span className="w-10 h-10 rounded-full bg-pine flex items-center justify-center font-serif text-lg font-semibold text-gold">P</span>
            <span className="font-serif text-lg font-semibold text-pine">Peeman Cleaning</span>
          </Link>
          <h1 className="font-serif text-3xl font-semibold text-pine mb-1">Welcome back</h1>
          <p className="text-brand-muted text-sm">Sign in to your account</p>
        </div>

        <div className="bg-white border border-cream-mid rounded-2xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="block text-xs uppercase tracking-wider text-brand-muted mb-1.5">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" autoComplete="email"
                className="w-full border border-cream-mid rounded px-3.5 py-2.5 text-ink text-sm outline-none focus:border-pine-light transition-colors bg-white" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-brand-muted mb-1.5">Password</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" autoComplete="current-password"
                  className="w-full border border-cream-mid rounded px-3.5 py-2.5 text-ink text-sm outline-none focus:border-pine-light transition-colors pr-10 bg-white" />
                <button type="button" onClick={() => setShowPw(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-ink">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            {error && <p className="text-red-500 text-xs bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full bg-pine text-cream py-3 rounded text-sm font-medium hover:bg-pine-mid transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-1">
              {loading && <Loader2 size={15} className="animate-spin" />}
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-brand-muted mt-5">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-pine-light hover:text-pine font-medium">Create one</Link>
          </p>
        </div>

        <p className="text-center text-xs text-brand-muted mt-4">
          Are you the site admin?{" "}
          <Link href="/admin/login" className="text-brand-muted hover:text-pine underline">Admin login →</Link>
        </p>
      </div>
    </div>
  );
}