import { Link } from "react-router-dom";

export default function AppFooter() {
  return (
    <footer className="border-t border-border bg-background/80 backdrop-blur-sm">
      <nav aria-label="Footer navigation" className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
          <Link to="/resident" className="font-medium text-foreground hover:text-primary transition-colors">
            Resident
          </Link>
          <Link to="/faculty" className="font-medium text-foreground hover:text-primary transition-colors">
            Faculty
          </Link>
          <Link to="/program-director" className="font-medium text-foreground hover:text-primary transition-colors">
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
