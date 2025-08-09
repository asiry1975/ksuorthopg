import { GraduationCap, Users, UserSquare2 } from "lucide-react";
import { Link } from "react-router-dom";
import AppHeader from "@/components/AppHeader";
const Index = () => {
  return <div className="min-h-screen relative">
      <AppHeader title="Home" />
      <header className="pt-8 pb-6 text-center">
        <h1 className="text-2xl font-bold text-primary-foreground">KSU Orthodontic Graduate Programs -  Faculty &amp; Residents Portal </h1>
        <p className="text-sm italic text-primary-foreground mt-2">Your centralized hub for clinical schedules, academic tools, and communication between faculty and residents</p>
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
                <p className="text-xs text-muted-foreground">Schedule Veiw</p>
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
      <div aria-hidden="true" className="absolute inset-0 bg-[url('/lovable-uploads/0c2b2b50-3499-4c1a-9dc1-d6fe23f22c67.png')] bg-cover bg-center pointer-events-none opacity-95 -z-10" />
    </div>;
};
export default Index;