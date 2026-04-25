"use client";
import { useState, FormEvent } from "react";
import Link from "next/link";
// import { useUserAuth } from "@/context/UserAuthContext";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useUserAuth } from "@/context/UserAuthContext";

export default function SignupPage() {
  const { signup } = useUserAuth();
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", password: "", phone: "",
  });
  const [showPw,  setShowPw]  = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      setError("All required fields must be filled."); return;
    }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true); setError("");
    try {
      await signup(form);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    } finally { setLoading(false); }
  };

  const inputCls = "w-full border border-cream-mid rounded px-3.5 py-2.5 text-ink text-sm outline-none focus:border-pine-light transition-colors bg-white";
  const labelCls = "block text-xs uppercase tracking-wider text-brand-muted mb-1.5";

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 pt-20 pb-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <span className="w-10 h-10 rounded-full bg-pine flex items-center justify-center font-serif text-lg font-semibold text-gold">P</span>
            <span className="font-serif text-lg font-semibold text-pine">Peeman Cleaning</span>
          </Link>
          <h1 className="font-serif text-3xl font-semibold text-pine mb-1">Create your account</h1>
          <p className="text-brand-muted text-sm">Join to book services and leave reviews</p>
        </div>

        <div className="bg-white border border-cream-mid rounded-2xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>First Name <span className="text-red-400">*</span></label>
                <input value={form.firstName} onChange={set("firstName")} placeholder="John"
                  className={inputCls} autoComplete="given-name" />
              </div>
              <div>
                <label className={labelCls}>Last Name <span className="text-red-400">*</span></label>
                <input value={form.lastName} onChange={set("lastName")} placeholder="Smith"
                  className={inputCls} autoComplete="family-name" />
              </div>
            </div>

            <div>
              <label className={labelCls}>Email Address <span className="text-red-400">*</span></label>
              <input type="email" value={form.email} onChange={set("email")}
                placeholder="your@email.com" className={inputCls} autoComplete="email" />
            </div>

            <div>
              <label className={labelCls}>Phone Number (optional)</label>
              <input type="tel" value={form.phone} onChange={set("phone")}
                placeholder="+44 7700 000000" className={inputCls} autoComplete="tel" />
            </div>

            <div>
              <label className={labelCls}>Password <span className="text-red-400">*</span></label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} value={form.password}
                  onChange={set("password")} placeholder="At least 6 characters"
                  className={`${inputCls} pr-10`} autoComplete="new-password" />
                <button type="button" onClick={() => setShowPw(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-ink">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-xs bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-pine text-cream py-3 rounded text-sm font-medium hover:bg-pine-mid transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-1">
              {loading && <Loader2 size={15} className="animate-spin" />}
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-brand-muted mt-5">
            Already have an account?{" "}
            <Link href="/login" className="text-pine-light hover:text-pine font-medium">Sign in</Link>
          </p>
        </div>

        <p className="text-center text-xs text-brand-muted mt-4">
          By creating an account you agree to our terms of service.
        </p>
      </div>
    </div>
  );
}