import React, { useEffect, useMemo, useState } from "react";
import AppHeader from "@/components/AppHeader";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
export default function ProfilePage() {
  const {
    session
  } = useAuth();
  const {
    toast
  } = useToast();
  const initialName = useMemo(() => session?.user?.user_metadata?.name as string || session?.user?.user_metadata?.full_name as string || session?.user?.user_metadata?.display_name as string || "", [session]);
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(session?.user?.email ?? "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  useEffect(() => {
    setName(initialName);
    setEmail(session?.user?.email ?? "");
  }, [initialName, session?.user?.email]);

  // Basic SEO for SPA
  useEffect(() => {
    document.title = "Profile | KSU Orthodontic Portal";
    const desc = "Manage your profile: update name, email, and password.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", window.location.href);
  }, []);
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    if (password && password.length < 6) {
      toast({
        title: "Password too short",
        description: "Use at least 6 characters.",
        variant: "destructive"
      });
      return;
    }
    if (password && password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please re-enter the same password.",
        variant: "destructive"
      });
      return;
    }
    setIsSaving(true);
    try {
      const redirectUrl = `${window.location.origin}/`;
      const updatePayload: Parameters<typeof supabase.auth.updateUser>[0] = {
        data: name ? {
          name
        } : undefined,
        email: email || undefined,
        password: password || undefined
      } as any;
      const {
        error
      } = await supabase.auth.updateUser(updatePayload, {
        emailRedirectTo: redirectUrl
      } as any);
      if (error) throw error;
      toast({
        title: "Profile updated",
        description: "Your changes have been saved."
      });
    } catch (err: any) {
      toast({
        title: "Update failed",
        description: err?.message || "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  return <div className="min-h-screen bg-background">
      <AppHeader title="Profile" />
      <main className="container mx-auto px-4 py-6">
        <section className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Account settings</CardTitle>
              
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="password">New password</Label>
                    <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" autoComplete="new-password" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirm password</Label>
                    <Input id="confirmPassword" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" autoComplete="new-password" />
                  </div>
                </div>
                <div className="pt-2">
                  <Button type="submit" disabled={isSaving} aria-label="Save profile changes">
                    {isSaving ? "Saving..." : "Save changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>;
}