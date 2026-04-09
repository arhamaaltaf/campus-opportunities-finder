import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { HeroSection } from "@/components/HeroSection";
import { CompanyCard } from "@/components/CompanyCard";
import { fetchCompanies, fetchOpportunities } from "@/lib/google-sheets";
import { Company, Opportunity } from "@/lib/types";

const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQPEApRSBsR_vdiHgD5R2FeZiTvfqYhN-ps2WBYlMEBC9ggv39x0CXH60R60jieFDs34afZbdpO55Ph/pub?gid=1876046638&single=true&output=csv";
const OPPORTUNITIES_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQPEApRSBsR_vdiHgD5R2FeZiTvfqYhN-ps2WBYlMEBC9ggv39x0CXH60R60jieFDs34afZbdpO55Ph/pub?gid=1819372727&single=true&output=csv";

const FEATURED_COUNT = 6;

export default function Index() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchCompanies(SHEET_CSV_URL).catch(() => [] as Company[]),
      fetchOpportunities(OPPORTUNITIES_CSV_URL).catch(() => [] as Opportunity[]),
    ]).then(([cos, opps]) => {
      setCompanies(cos);
      setOpportunities(opps);
    }).finally(() => setLoading(false));
  }, []);

  const openCount = opportunities.filter((o) => o.status === "Open").length;
  const featuredCompanies = companies.slice(0, FEATURED_COUNT);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 h-14">
          <span className="font-bold text-foreground text-lg tracking-tight">OpBoard</span>
          <Link
            to="/opportunities"
            className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
          >
            Browse Opportunities
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      <HeroSection
        searchQuery=""
        onSearchChange={() => {}}
        totalCount={opportunities.length}
        openCount={openCount}
      />

      {/* CTA to opportunities */}
      <section className="px-4 pb-8">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/opportunities"
            className="block w-full rounded-xl bg-primary text-primary-foreground text-center py-4 font-semibold text-lg hover:opacity-90 transition-opacity shadow-md"
          >
            Explore All {opportunities.length} Opportunities →
          </Link>
        </div>
      </section>

      {/* Featured companies */}
      <section className="px-4 pb-20">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Featured Companies</h2>
            <span className="text-sm text-muted-foreground">{companies.length} total</span>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featuredCompanies.map((company) => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
