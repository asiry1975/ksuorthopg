import { useState, MouseEvent } from "react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";

type AccessGuardLinkProps = {
  to: string;
  className?: string;
  children: React.ReactNode;
  requiredRoles?: string[];
  label?: string;
  replace?: boolean;
};

export default function AccessGuardLink({
  to,
  className,
  children,
  requiredRoles,
  label,
  replace,
}: AccessGuardLinkProps) {
  const { roles } = useAuth();
  const [open, setOpen] = useState(false);

  const hasAccess = (required?: string[]) => {
    if (!required || required.length === 0) return true;
    return roles.includes("admin") || roles.some((r) => required.includes(r));
  };

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!hasAccess(requiredRoles)) {
      e.preventDefault();
      e.stopPropagation();
      setOpen(true);
    }
  };

  return (
    <>
      <Link to={to} onClick={onClick} className={className} replace={replace}>
        {children}
      </Link>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Access restricted</DialogTitle>
            <DialogDescription>
              You do not have permission to access {label ?? "this section"}. Please sign in.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
