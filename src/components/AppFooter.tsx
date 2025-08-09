import { Link } from "react-router-dom";

export default function AppFooter() {
  return (
    <footer className="border-t border-border bg-[hsl(var(--accent-strong))]">
      <nav aria-label="Footer navigation" className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <Link to="/" className="text-center font-medium text-foreground hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/resident" className="text-center font-medium text-foreground hover:text-primary transition-colors">
            Resident
          </Link>
          <Link to="/faculty" className="text-center font-medium text-foreground hover:text-primary transition-colors">
            Faculty
          </Link>
          <Link to="/program-director" className="text-center font-medium text-foreground hover:text-primary transition-colors">
            Program Director
          </Link>
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Copyright © 2025 All Rights Reserved to Prof, Moshabab Asiry
        </p>
      </nav>
    </footer>
  );
}
