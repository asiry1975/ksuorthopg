import { GraduationCap, Users, UserSquare2 } from "lucide-react";
import { Link } from "react-router-dom";
import AppHeader from "@/components/AppHeader";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <AppHeader title="Home" />
      <header className="pt-8 pb-6 text-center">
        <h1 className="text-2xl font-bold">KSU Orthodontic Graduate Programs</h1>
        <p className="text-sm text-muted-foreground mt-2">Tools for residents and faculty in orthodontic graduate program</p>
      </header>
      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link to="/resident" className="rounded-xl border bg-card p-6 shadow-sm active:scale-[0.98] transition">
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6" />
              <div>
                <h2 className="text-lg font-semibold">Resident</h2>
                <p className="text-xs text-muted-foreground">Form and schedule view</p>
              </div>
            </div>
          </Link>

          <Link to="/faculty" className="rounded-xl border bg-card p-6 shadow-sm active:scale-[0.98] transition">
            <div className="flex items-center gap-3">
              <UserSquare2 className="h-6 w-6" />
              <div>
                <h2 className="text-lg font-semibold">Faculty</h2>
                <p className="text-xs text-muted-foreground">Schedule results</p>
              </div>
            </div>
          </Link>

          <Link to="/program-director" className="rounded-xl border bg-card p-6 shadow-sm active:scale-[0.98] transition">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-6 w-6" />
              <div>
                <h2 className="text-lg font-semibold">Program Director</h2>
                <p className="text-xs text-muted-foreground">Tools and insights</p>
              </div>
            </div>
          </Link>
        </div>
      </main>
      <div aria-hidden="true" className="fixed inset-0 bg-[url('/lovable-uploads/ba2a01be-906d-4353-8786-be50ca9e1525.png')] bg-cover bg-center pointer-events-none opacity-5 -z-10" />
    </div>
  );
};

export default Index;
