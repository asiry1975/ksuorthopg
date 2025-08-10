import { ClipboardList, Eye, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import AppHeader from "@/components/AppHeader";

export default function ResidentHome() {
  const items = [
    { to: "/resident/schedule", icon: ClipboardList, label: "Resident Schedule Form" },
    { to: "/resident/schedule-test", icon: ClipboardList, label: "Resident Schedule Form Test" },
    { to: "/resident/view", icon: Eye, label: "Resident View" },
    { to: "/coming-soon", icon: Sparkles, label: "Coming Soon" },
    { to: "/coming-soon", icon: Sparkles, label: "Coming Soon" },
    { to: "/coming-soon", icon: Sparkles, label: "Coming Soon" },
    { to: "/coming-soon", icon: Sparkles, label: "Coming Soon" },
  ];

  return (
    <div className="min-h-screen relative">
      <AppHeader title="Resident" />
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
      <div aria-hidden="true" className="absolute inset-0 bg-[url('/lovable-uploads/0c2b2b50-3499-4c1a-9dc1-d6fe23f22c67.png')] bg-cover bg-center pointer-events-none opacity-95 -z-10" />
    </div>
  );
}
