import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GlobalQuickLinks from "@/components/GlobalQuickLinks";

export default function AppHeader({ title }: { title: string }) {
  const navigate = useNavigate();
  return (
    <>
      <header dir="rtl" className="sticky top-0 z-40 bg-background border-b shadow-sm">
        <div className="container mx-auto flex flex-row-reverse items-center h-12 gap-2 px-3">
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
      <div className="container mx-auto px-3 py-2">
        <div className="flex items-center justify-between">
          <img
            src="/lovable-uploads/c233c4b5-45bf-486c-96a0-cf5049f9e2b0.png"
            alt="King Saud University logo"
            className="h-20 w-auto select-none"
            loading="lazy"
          />
          <div dir="rtl">
            <GlobalQuickLinks />
          </div>
        </div>
      </div>
    </>
  );
}
