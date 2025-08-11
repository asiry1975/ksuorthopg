import { GraduationCap, Users, UserSquare2 } from "lucide-react";
import { Link } from "react-router-dom";
import AppHeader from "@/components/AppHeader";
import AccessGuardLink from "@/components/AccessGuardLink";
const Index = () => {
  return <div className="min-h-screen relative">
      <AppHeader title="Home" />
      <header className="pt-8 pb-6 text-center">
        <h1 className="text-2xl font-bold text-foreground">KSU Orthodontic Graduate Programs -  Faculty &amp; Residents Portal </h1>
        <p className="text-sm italic text-foreground mt-2">Your centralized hub for clinical schedules, academic tools, and communication between faculty and residents</p>
      </header>
      <nav className="container mx-auto px-4 pb-2 text-right"><Link to="/auth" className="underline text-primary">Login</Link></nav>
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
      {/* Custom HTML block to inject PWA assets from Supabase */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
(function () {
  var MANIFEST_URL = 'https://sfxifyrtdyndjfiszoyk.supabase.co/storage/v1/object/public/pwa/manifest.json';
  var APPLE_ICON  = 'https://sfxifyrtdyndjfiszoyk.supabase.co/storage/v1/object/public/pwa/icons/icon-180.png';
  var THEME_COLOR = '#0b5c2b';

  var m = document.createElement('link');
  m.rel = 'manifest';
  m.href = MANIFEST_URL;
  document.head.appendChild(m);

  var i = document.createElement('link');
  i.rel = 'apple-touch-icon';
  i.href = APPLE_ICON;
  document.head.appendChild(i);

  var t = document.createElement('meta');
  t.name = 'theme-color';
  t.content = THEME_COLOR;
  document.head.appendChild(t);

  // Optional: Add an iPhone splash if uploaded to Supabase Storage
  // function startup(href, media) {
  //   var s = document.createElement('link');
  //   s.rel = 'apple-touch-startup-image';
  //   s.href = href;
  //   s.media = media;
  //   document.head.appendChild(s);
  // }
  // startup('https://sfxifyrtdyndjfiszoyk.supabase.co/storage/v1/object/public/pwa/splash/splash-1170x2532.png',
  //   '(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)');
})();
          `,
        }}
      />
    </div>;
  };
  export default Index;