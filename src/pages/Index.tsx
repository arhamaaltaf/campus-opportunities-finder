import { useState, useEffect } from "react";
import { HeroSection } from "@/components/HeroSection";
import { OpportunitiesList } from "@/components/OpportunitiesList";
import { fetchOpportunities, getMockOpportunities } from "@/lib/google-sheets";
import { Opportunity } from "@/lib/types";

const SHEET_CSV_URL = import.meta.env.VITE_GOOGLE_SHEET_CSV_URL as string | undefined;

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        if (SHEET_CSV_URL) {
          const data = await fetchOpportunities(SHEET_CSV_URL);
          setOpportunities(data);
        } else {
          setOpportunities(getMockOpportunities());
        }
      } catch {
        setOpportunities(getMockOpportunities());
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const openCount = opportunities.filter((o) => o.status === "Open").length;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-4 h-14">
          <span className="font-bold text-foreground text-lg tracking-tight">OpBoard</span>
          <span className="text-xs text-muted-foreground">Updated daily</span>
        </div>
      </header>

      <HeroSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalCount={opportunities.length}
        openCount={openCount}
      />

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      ) : (
        <OpportunitiesList opportunities={opportunities} searchQuery={searchQuery} />
      )}
    </div>
  );
}
