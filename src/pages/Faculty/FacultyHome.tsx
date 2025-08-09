import { Eye, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import AppHeader from "@/components/AppHeader";

export default function FacultyHome() {
  const items = [
    { to: "/faculty/view", icon: Eye, label: "Faculty View" },
    { to: "/coming-soon", icon: Sparkles, label: "Coming Soon" },
    { to: "/coming-soon", icon: Sparkles, label: "Coming Soon" },
    { to: "/coming-soon", icon: Sparkles, label: "Coming Soon" },
    { to: "/coming-soon", icon: Sparkles, label: "Coming Soon" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Faculty" />
      <main className="container mx-auto p-4">
        <div className="grid grid-cols-2 gap-3">
          {items.map((it, idx) => (
            <Link
              key={idx}
              to={it.to}
              className="rounded-xl border bg-card p-4 shadow-sm active:scale-[0.98] transition"
            >
              <div className="flex items-center gap-3">
                <it.icon className="h-5 w-5" />
                <span className="text-sm font-medium">{it.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
