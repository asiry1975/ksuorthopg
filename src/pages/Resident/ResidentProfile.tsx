import React from "react";
import ProfilePage from "../Profile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ResidentProfile() {
  return (
    <>
      <ProfilePage />
      <main className="container mx-auto px-4 py-6">
        <section className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Assessment Results</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Coming soon.</p>
            </CardContent>
          </Card>
        </section>
      </main>
    </>
  );
}
