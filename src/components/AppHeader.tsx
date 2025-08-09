import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AppHeader({ title }: { title: string }) {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-40 bg-background border-b shadow-sm">
      <div className="container mx-auto flex items-center h-12 gap-2 px-3">
        <button
          aria-label="Go back"
          onClick={() => navigate(-1)}
          className="rounded-md p-2 hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="text-base font-semibold">{title}</h1>
      </div>
    </header>
  );
}
