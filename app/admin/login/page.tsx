"use client";
import { useState, FormEvent } from "react";
import { useAdminAuth } from "@/context/AdminAuthContexxt";
import { Loader2, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const { login } = useAdminAuth();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Both fields are required."); return; }
    setLoading(true);
    setError("");
    try {
      await login(email.trim(), password);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pine flex items-center justify-center px-4">
      {/* Decorative ring */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full border border-sage/10" />
        <div className="absolute -bottom-20 -left-20 w-[320px] h-[320px] rounded-full border border-sage/[0.06]" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-gold flex items-center justify-center font-serif text-2xl font-semibold text-pine mx-auto mb-4">
            P
          </div>
          <h1 className="font-serif text-2xl font-semibold text-cream">Admin Login</h1>
          <p className="text-white/45 text-sm mt-1">Peeman Cleaning Services</p>
        </div>

        {/* Card */}
        <div className="bg-white/[0.07] border border-sage/20 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email */}
            <div>
              <label className="block text-[0.75rem] uppercase tracking-widest text-white/45 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@peemanclean.co.uk"
                autoComplete="email"
                className="w-full bg-white/[0.08] border border-sage/25 rounded px-3.5 py-2.5 text-cream text-sm placeholder:text-white/25 outline-none focus:border-sage transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[0.75rem] uppercase tracking-widest text-white/45 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full bg-white/[0.08] border border-sage/25 rounded px-3.5 py-2.5 text-cream text-sm placeholder:text-white/25 outline-none focus:border-sage transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                  tabIndex={-1}
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded px-3 py-2">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold text-pine py-3 rounded text-sm font-medium hover:bg-gold-light transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            >
              {loading && <Loader2 size={15} className="animate-spin" />}
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-white/25 text-xs mt-6">
          Restricted access — authorised personnel only
        </p>
      </div>
    </div>
  );
}
