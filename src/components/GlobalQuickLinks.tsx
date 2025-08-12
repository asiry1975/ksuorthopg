import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, LogOut, LogIn } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";

export default function GlobalQuickLinks() {
const { signOut, session, roles } = useAuth();
  const navigate = useNavigate();

  const [deniedOpen, setDeniedOpen] = useState(false);
  const [deniedTarget, setDeniedTarget] = useState<string | null>(null);

  const hasAccess = (required?: string[]) => {
    if (!required || required.length === 0) return true;
    return roles.includes("admin") || roles.some((r) => required.includes(r));
  };

  const handleNavigate = (path: string, label: string, requiredRoles?: string[]) => {
    if (hasAccess(requiredRoles)) {
      navigate(path);
    } else {
      setDeniedTarget(label);
      setDeniedOpen(true);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth", { replace: true });
  };

  return (
    <div className="relative z-30">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" aria-label="Open quick links">
            <Menu className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          sideOffset={8}
          className="z-50 bg-popover text-popover-foreground border border-border shadow-lg"
        >
          <DropdownMenuLabel>Quick Links</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => handleNavigate("/", "Home")}>
            Home
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleNavigate("/resident", "Resident", ["resident"]) }>
            Resident
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleNavigate("/faculty", "Faculty", ["faculty"]) }>
            Faculty
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleNavigate("/program-director", "Program Director", ["program_director"]) }>
            Program Director
          </DropdownMenuItem>
          <DropdownMenuSeparator />
{session ? (
            <DropdownMenuItem onSelect={handleSignOut} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" /> Sign out
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onSelect={() => navigate("/auth")}> 
              <span className="flex items-center"><LogIn className="mr-2 h-4 w-4" /> Sign in</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={deniedOpen} onOpenChange={setDeniedOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Access restricted</DialogTitle>
            <DialogDescription>
              You do not have permission to access {deniedTarget ?? "this section"}. Please sign in.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => setDeniedOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
