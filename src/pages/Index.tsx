import { GraduationCap, Users, UserSquare2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import AppHeader from "@/components/AppHeader";
import AccessGuardLink from "@/components/AccessGuardLink";
const Index = () => {
  useEffect(() => {
    // Inject manifest, icons, and theme color into <head>
    const MANIFEST_URL = '/manifest.webmanifest';
    const ICON_180 = 'https://sfxifyrtdyndjfiszoyk.supabase.co/storage/v1/object/public/pwa/icon/icon-180.png';
    const ICON_192 = 'https://sfxifyrtdyndjfiszoyk.supabase.co/storage/v1/object/public/pwa/icon/icon-192.png';
    const ICON_512 = 'https://sfxifyrtdyndjfiszoyk.supabase.co/storage/v1/object/public/pwa/icon/icon-512.png';
    const ICON_512_MASKABLE = 'https://sfxifyrtdyndjfiszoyk.supabase.co/storage/v1/object/public/pwa/icon/icon-512-maskable.png';
    const THEME_COLOR = '#004B87'; // KSU blue

    // Manifest
    const m = document.createElement('link');
    m.rel = 'manifest';
    m.href = MANIFEST_URL;
    document.head.appendChild(m);

    // iOS apple-touch icon
    const i = document.createElement('link');
    i.rel = 'apple-touch-icon';
    i.href = ICON_180;
    document.head.appendChild(i);

    // Favicons / Android / Web
    [ICON_192, ICON_512, ICON_512_MASKABLE].forEach(url => {
      const link = document.createElement('link');
      link.rel = 'icon';
      link.href = url;
      document.head.appendChild(link);
    });

    // Theme color
    const t = document.createElement('meta');
    t.name = 'theme-color';
    t.content = THEME_COLOR;
    document.head.appendChild(t);
  }, []);
  return <div className="min-h-screen relative">
      <AppHeader title="Home" />
      <header className="pt-8 pb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-50">KSU Orthodontic Graduate Programs -  Faculty &amp; Residents Portal </h1>
        <p className="text-sm italic mt-2 font-semibold text-gray-50">Your centralized hub for clinical schedules, academic tools, and communication between faculty and residents</p>
      </header>
      
      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <AccessGuardLink to="/resident" requiredRoles={["resident"]} label="Resident" className="rounded-xl border bg-card p-6 shadow-sm active:scale-[0.98] transition">
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6" />
              <div>
                <h2 className="text-lg font-semibold">Resident</h2>
                <p className="text-xs text-muted-foreground">Form and schedule view</p>
              </div>
            </div>
          </AccessGuardLink>

          <AccessGuardLink to="/faculty" requiredRoles={["faculty"]} label="Faculty" className="rounded-xl border bg-card p-6 shadow-sm active:scale-[0.98] transition">
            <div className="flex items-center gap-3">
              <UserSquare2 className="h-6 w-6" />
              <div>
                <h2 className="text-lg font-semibold">Faculty</h2>
                <p className="text-xs text-muted-foreground">Schedule Veiw</p>
              </div>
            </div>
          </AccessGuardLink>

          <AccessGuardLink to="/program-director" requiredRoles={["program_director"]} label="Program Director" className="rounded-xl border bg-card p-6 shadow-sm active:scale-[0.98] transition">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-6 w-6" />
              <div>
                <h2 className="text-lg font-semibold">Program Director</h2>
                <p className="text-xs text-muted-foreground">Tools and insights</p>
              </div>
            </div>
          </AccessGuardLink>
        </div>
      </main>
      <div aria-hidden="true" className="absolute inset-0 bg-[url('/lovable-uploads/0c2b2b50-3499-4c1a-9dc1-d6fe23f22c67.png')] bg-cover bg-center pointer-events-none opacity-95 -z-10" />
    </div>;
};
export default Index;