import { UserAuthProvider } from "@/context/UserAuthContext";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <UserAuthProvider>{children}</UserAuthProvider>;
}