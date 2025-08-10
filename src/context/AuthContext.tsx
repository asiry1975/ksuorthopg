import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "resident" | "faculty" | "program_director" | "admin" | string;

type AuthContextType = {
  user: User | null;
  session: Session | null;
  roles: AppRole[];
  isLoading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const deriveRolesFromMetadata = (u: User | null): AppRole[] => {
    const raw = (u as any)?.user_metadata?.roles ?? (u as any)?.user_metadata?.role;
    if (Array.isArray(raw)) return raw.map((r: any) => String(r) as AppRole);
    if (raw) return [String(raw) as AppRole];
    return [];
  };

  // Fetch roles for the current user
  const loadRoles = async (uid: string) => {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", uid);

    if (!error && Array.isArray(data) && data.length > 0) {
      setRoles(data.map((r) => String(r.role) as AppRole));
    }
  };

  useEffect(() => {
    // 1) Subscribe to auth changes first
    const { data: listener } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      setRoles(deriveRolesFromMetadata(s?.user ?? null));
      if (s?.user) {
        // Defer supabase calls to avoid deadlocks in the callback
        setTimeout(() => {
          loadRoles(s.user.id).finally(() => setIsLoading(false));
        }, 0);
      } else {
        setRoles([]);
        setIsLoading(false);
      }
    });

    // 2) Then check for existing session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setRoles(deriveRolesFromMetadata(data.session?.user ?? null));
      if (data.session?.user) {
        loadRoles(data.session.user.id).finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setRoles([]);
  };

  return (
    <AuthContext.Provider value={{ user, session, roles, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
