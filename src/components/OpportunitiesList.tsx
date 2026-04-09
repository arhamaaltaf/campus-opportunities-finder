import { useMemo, useState } from "react";
import { Opportunity } from "@/lib/types";
import { FilterTabs } from "./FilterTabs";
import { OpportunityCard } from "./OpportunityCard";

interface OpportunitiesListProps {
  opportunities: Opportunity[];
  searchQuery: string;
}

export function OpportunitiesList({ opportunities, searchQuery }: OpportunitiesListProps) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [bookmarks, setBookmarks] = useState<Set<string>>(() => {
    const saved = localStorage.getItem("bookmarks");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  const toggleBookmark = (id: string) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem("bookmarks", JSON.stringify([...next]));
      return next;
    });
  };

  const filtered = useMemo(() => {
    let items = opportunities;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (o) =>
          o.companyName.toLowerCase().includes(q) ||
          o.role.toLowerCase().includes(q)
      );
    }

    if (activeFilter !== "all") {
      items = items.filter((o) => o.category === activeFilter);
    }

    return items.sort((a, b) => {
      if (a.status === "Open" && b.status !== "Open") return -1;
      if (a.status !== "Open" && b.status === "Open") return 1;
      return 0;
    });
  }, [opportunities, searchQuery, activeFilter]);

  const counts = useMemo(() => {
    const base = searchQuery
      ? opportunities.filter(o => o.companyName.toLowerCase().includes(searchQuery.toLowerCase()) || o.role.toLowerCase().includes(searchQuery.toLowerCase()))
      : opportunities;
    return {
      all: base.length,
      Internship: base.filter((o) => o.category === "Internship").length,
      "Brand Ambassador": base.filter((o) => o.category === "Brand Ambassador").length,
      MT: base.filter((o) => o.category === "MT").length,
    };
  }, [opportunities, searchQuery]);

  return (
    <section className="px-4 pb-20">
      <div className="max-w-4xl mx-auto space-y-6">
        <FilterTabs active={activeFilter} onChange={setActiveFilter} counts={counts} />

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg font-medium">No opportunities found</p>
            <p className="text-sm mt-1">Try a different search or filter</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {filtered.map((opp) => (
              <OpportunityCard
                key={opp.id}
                opportunity={opp}
                isBookmarked={bookmarks.has(opp.id)}
                onToggleBookmark={toggleBookmark}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
