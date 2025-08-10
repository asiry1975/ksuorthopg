import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation() as any;

  useEffect(() => {
    document.title = mode === "login" ? "Login - KSU Ortho Portal" : "Sign up - KSU Ortho Portal";
  }, [mode]);

  const redirectAfterLogin = async () => {
    // Try to send user to the page they came from
    const from = location.state?.from?.pathname as string | undefined;

    // Fetch roles to decide a default destination
    const { data } = await supabase.from("user_roles").select("role");
    const roles = (data || []).map((r) => String(r.role));

    if (from) return navigate(from, { replace: true });

    if (roles.includes("program_director")) return navigate("/program-director", { replace: true });
    if (roles.includes("faculty")) return navigate("/faculty", { replace: true });
    if (roles.includes("resident")) return navigate("/resident", { replace: true });

    return navigate("/", { replace: true });
  };

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message || "Login failed");
      return;
    }

    toast.success("Logged in. Please change your password on first login.");
    redirectAfterLogin();
  };

  const handleSignup = async () => {
    setLoading(true);
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectUrl },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message || "Sign up failed");
      return;
    }
    toast.success("Check your email to confirm your account.");
    setMode("login");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "login") await handleLogin();
    else await handleSignup();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <main className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>{mode === "login" ? "Login" : "Create account"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4" aria-label={mode === "login" ? "Login form" : "Sign up form"}>
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Please wait..." : mode === "login" ? "Login" : "Sign up"}
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-4">
              Default first-time passwords: resident, faculty, admin. Please change immediately after login.
            </p>
            <div className="text-sm mt-4">
              {mode === "login" ? (
                <button className="underline text-primary" onClick={() => setMode("signup")}>
                  Need an account? Sign up
                </button>
              ) : (
                <button className="underline text-primary" onClick={() => setMode("login")}>
                  Already have an account? Login
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
