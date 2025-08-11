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
  const { session, roles } = useAuth();
  const {
    toast
  } = useToast();
  const initialName = useMemo(() => session?.user?.user_metadata?.name as string || session?.user?.user_metadata?.full_name as string || session?.user?.user_metadata?.display_name as string || "", [session]);
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(session?.user?.email ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const roleTitle = useMemo(
    () => (roles.includes("faculty") ? "Faculty Profile" : roles.includes("resident") ? "Resident Profile" : "Profile"),
    [roles]
  );

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
    setIsSaving(true);
    try {
      const redirectUrl = `${window.location.origin}/`;
      const updatePayload: Parameters<typeof supabase.auth.updateUser>[0] = {
        data: name ? { name } : undefined,
        email: email || undefined
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
              <CardTitle>{roleTitle}</CardTitle>
              
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={name} placeholder="Your name" readOnly disabled />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} placeholder="name@example.com" readOnly disabled />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" value={roles.join(", ")} readOnly disabled />
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