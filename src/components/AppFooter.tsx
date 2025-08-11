import AccessGuardLink from "@/components/AccessGuardLink";

export default function AppFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <nav aria-label="Footer navigation" className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <AccessGuardLink to="/" className="text-center font-medium text-foreground hover:text-primary transition-colors" label="Home">
            Home
          </AccessGuardLink>
          <AccessGuardLink to="/resident" requiredRoles={["resident"]} label="Resident" className="text-center font-medium text-foreground hover:text-primary transition-colors">
            Resident
          </AccessGuardLink>
          <AccessGuardLink to="/faculty" requiredRoles={["faculty"]} label="Faculty" className="text-center font-medium text-foreground hover:text-primary transition-colors">
            Faculty
          </AccessGuardLink>
          <AccessGuardLink to="/program-director" requiredRoles={["program_director"]} label="Program Director" className="text-center font-medium text-foreground hover:text-primary transition-colors">
            Program Director
          </AccessGuardLink>
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Copyright © 2025 All Rights Reserved to Prof, Moshabab Asiry
        </p>
      </nav>
    </footer>
  );
}
