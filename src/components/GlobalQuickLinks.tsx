import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

export default function GlobalQuickLinks() {
  return (
    <div className="fixed top-3 right-3 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" aria-label="Open quick links">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="z-50 bg-popover text-popover-foreground border border-border shadow-lg"
        >
          <DropdownMenuLabel>Quick Links</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/">Home</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/resident">Resident</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/faculty">Faculty</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/program-director">Program Director</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
