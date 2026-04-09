import { useState, useEffect } from "react";
import { HeroSection } from "@/components/HeroSection";
import { CompanyList } from "@/components/CompanyList";
import { fetchCompanies } from "@/lib/google-sheets";
import { Company } from "@/lib/types";

const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQMMGWLN6AE5kcEXJxTQ0ybibnMkCWFGSdmZD53bTvVGsVQDpiBNMUKwgy2wSgjAJwnTxq2fxBIO5tS/pub?output=csv";

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies(SHEET_CSV_URL)
      .then(setCompanies)
      .catch(() => setCompanies([]))
      .finally(() => setLoading(false));
  }, []);

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
        totalCount={companies.length}
        openCount={companies.length}
      />

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      ) : (
        <CompanyList companies={companies} searchQuery={searchQuery} />
      )}
    </div>
  );
}
