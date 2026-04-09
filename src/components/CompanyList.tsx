import { useMemo, useState } from "react";
import { Company } from "@/lib/types";
import { CompanyCard } from "./CompanyCard";

interface CompanyListProps {
  companies: Company[];
  searchQuery: string;
}

const INDUSTRIES = ["All", "FMCG", "Finance", "Tech", "Consulting", "Other"] as const;

export function CompanyList({ companies, searchQuery }: CompanyListProps) {
  const [activeIndustry, setActiveIndustry] = useState("All");

  const filtered = useMemo(() => {
    let items = companies;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.industry.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q)
      );
    }
    if (activeIndustry !== "All") {
      items = items.filter(c => c.industry === activeIndustry);
    }
    return items;
  }, [companies, searchQuery, activeIndustry]);

  const counts = useMemo(() => {
    const base = searchQuery
      ? companies.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.industry.toLowerCase().includes(searchQuery.toLowerCase()))
      : companies;
    const result: Record<string, number> = { All: base.length };
    INDUSTRIES.forEach(ind => {
      if (ind !== "All") result[ind] = base.filter(c => c.industry === ind).length;
    });
    return result;
  }, [companies, searchQuery]);

  return (
    <section className="px-4 pb-20">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-wrap gap-2">
          {INDUSTRIES.map(ind => (
            <button
              key={ind}
              onClick={() => setActiveIndustry(ind)}
              className={
                activeIndustry === ind
                  ? "px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground shadow-sm transition-all"
                  : "px-4 py-2 rounded-lg text-sm font-medium bg-card text-muted-foreground hover:text-foreground hover:bg-secondary border border-border transition-all"
              }
            >
              {ind}
              <span className={activeIndustry === ind ? "ml-2 text-xs text-primary-foreground/70" : "ml-2 text-xs text-muted-foreground"}>
                {counts[ind] ?? 0}
              </span>
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg font-medium">No companies found</p>
            <p className="text-sm mt-1">Try a different search or filter</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {filtered.map(company => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
