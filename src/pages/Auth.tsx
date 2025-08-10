import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RESIDENTS, FACULTY } from "@/context/ScheduleContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"resident" | "faculty" | "">("");
  const [selectedName, setSelectedName] = useState("");
  const navigate = useNavigate();
  const location = useLocation() as any;

useEffect(() => {
    document.title = mode === "login" ? "Login - KSU Ortho Portal" : "Sign up - KSU Ortho Portal";
  }, [mode]);

  useEffect(() => {
    if (mode === "login") {
      setSelectedRole("");
      setSelectedName("");
    }
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
    if (!selectedRole) {
      toast.error("Please select a role.");
      setLoading(false);
      return;
    }
    if (!selectedName) {
      toast.error("Please select your name.");
      setLoading(false);
      return;
    }
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { 
        emailRedirectTo: redirectUrl,
        data: { role: selectedRole, display_name: selectedName }
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message || "Sign up failed");
      return;
    }
    toast.success("Check your email to confirm your account.");
    setMode("login");
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Enter your email first");
      return;
    }
    setLoading(true);
    const redirectUrl = `${window.location.origin}/auth/recovery`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: redirectUrl });
    setLoading(false);
    if (error) {
      toast.error(error.message || "Failed to send reset email");
      return;
    }
    toast.success("Password reset email sent. Check your inbox.");
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
              {mode === "signup" && (
                <>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Select value={selectedRole} onValueChange={(v) => { setSelectedRole(v as any); setSelectedName(""); }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent className="z-50">
                        <SelectItem value="resident">Resident</SelectItem>
                        <SelectItem value="faculty">Faculty</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>{selectedRole === "resident" ? "Resident name" : selectedRole === "faculty" ? "Faculty name" : "Name"}</Label>
                    <Select value={selectedName} onValueChange={setSelectedName} disabled={!selectedRole}>
                      <SelectTrigger>
                        <SelectValue placeholder={!selectedRole ? "Select role first" : "Select name"} />
                      </SelectTrigger>
                      <SelectContent className="z-50 max-h-64">
                        {(selectedRole === "resident" ? RESIDENTS : selectedRole === "faculty" ? FACULTY : []).map((n) => (
                          <SelectItem key={n} value={n}>{n}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
<div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                {mode === "login" && (
                  <div className="text-right">
                    <button type="button" className="text-sm underline text-primary" onClick={handleForgotPassword}>
                      Forgot password?
                    </button>
                  </div>
                )}
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
