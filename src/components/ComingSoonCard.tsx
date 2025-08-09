export function ComingSoonCard({ label }: { label: string }) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground p-4 shadow-sm">
      <div className="text-sm font-medium">{label}</div>
      <div className="text-xs text-muted-foreground mt-1">Coming soon</div>
    </div>
  );
}
