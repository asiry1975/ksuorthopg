import AppHeader from "@/components/AppHeader";
export default function ComingSoonPage() {
  return <div className="min-h-screen bg-background">
      <AppHeader title="Coming Soon" />
      <main className="container mx-auto p-4">
        <div className="rounded-xl border p-6 text-center bg-card">
          <h2 className="text-xl font-semibold">Coming Soon</h2>
          
        </div>
      </main>
    </div>;
}