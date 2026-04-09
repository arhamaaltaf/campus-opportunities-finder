import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowLeft, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { OpportunityCard } from "@/components/OpportunityCard";
import { fetchCompanies, fetchOpportunities, enrichOpportunities } from "@/lib/google-sheets";
import { Company, Opportunity } from "@/lib/types";
import { FilterCombobox } from "@/components/FilterCombobox";

const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQPEApRSBsR_vdiHgD5R2FeZiTvfqYhN-ps2WBYlMEBC9ggv39x0CXH60R60jieFDs34afZbdpO55Ph/pub?gid=1876046638&single=true&output=csv";
const OPPORTUNITIES_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQPEApRSBsR_vdiHgD5R2FeZiTvfqYhN-ps2WBYlMEBC9ggv39x0CXH60R60jieFDs34afZbdpO55Ph/pub?gid=1819372727&single=true&output=csv";

export default function Opportunities() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

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

  useEffect(() => {
    Promise.all([
      fetchCompanies(SHEET_CSV_URL).catch(() => [] as Company[]),
      fetchOpportunities(OPPORTUNITIES_CSV_URL).catch(() => [] as Opportunity[]),
    ]).then(([cos, opps]) => {
      setCompanies(cos);
      setOpportunities(enrichOpportunities(opps, cos));
    }).finally(() => setLoading(false));
  }, []);

  // Extract unique filter options from data
  const filterOptions = useMemo(() => {
    const roleTypes = new Set<string>();
    const industries = new Set<string>();
    const departments = new Set<string>();
    const statuses = new Set<string>();

    opportunities.forEach((o) => {
      if (o.category) roleTypes.add(o.category);
      if (o.industry) industries.add(o.industry);
      if (o.departments) o.departments.forEach((d) => departments.add(d));
      if (o.status) statuses.add(o.status);
    });

    return {
      roleTypes: Array.from(roleTypes).sort(),
      industries: Array.from(industries).sort(),
      departments: Array.from(departments).sort(),
      statuses: Array.from(statuses).sort(),
    };
  }, [opportunities]);

  const filtered = useMemo(() => {
    let items = opportunities;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (o) =>
          o.companyName.toLowerCase().includes(q) ||
          o.role.toLowerCase().includes(q) ||
          (o.description?.toLowerCase().includes(q) ?? false)
      );
    }

    if (roleFilter !== "all") {
      items = items.filter((o) => o.category === roleFilter);
    }
    if (industryFilter !== "all") {
      items = items.filter((o) => o.industry === industryFilter);
    }
    if (departmentFilter !== "all") {
      items = items.filter((o) => o.departments?.includes(departmentFilter));
    }
    if (statusFilter !== "all") {
      items = items.filter((o) => o.status === statusFilter);
    }

    return items;
  }, [opportunities, searchQuery, roleFilter, industryFilter, departmentFilter, statusFilter]);

  const activeFilterCount = [roleFilter, industryFilter, departmentFilter, statusFilter].filter(
    (f) => f !== "all"
  ).length;

  const clearFilters = () => {
    setRoleFilter("all");
    setIndustryFilter("all");
    setDepartmentFilter("all");
    setStatusFilter("all");
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 h-14">
          <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="font-bold text-lg tracking-tight">OpBoard</span>
          </Link>
          <span className="text-xs text-muted-foreground">{filtered.length} opportunities</span>
        </div>
      </header>

      <section className="pt-8 pb-6 px-4">
        <div className="max-w-5xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              All Opportunities
            </h1>
            <p className="text-muted-foreground mt-1">
              Browse internships, MT programs, ambassador roles and more
            </p>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search companies or roles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-card border-border shadow-sm"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
              <Filter className="h-4 w-4" />
              Filters
            </div>

            <FilterCombobox
              value={roleFilter}
              onChange={setRoleFilter}
              options={filterOptions.roleTypes}
              allLabel="All Role Types"
              placeholder="Role Type"
              width="w-[160px]"
            />

            <FilterCombobox
              value={industryFilter}
              onChange={setIndustryFilter}
              options={filterOptions.industries}
              allLabel="All Industries"
              placeholder="Industry"
              width="w-[160px]"
            />

            <FilterCombobox
              value={departmentFilter}
              onChange={setDepartmentFilter}
              options={filterOptions.departments}
              allLabel="All Departments"
              placeholder="Department"
              width="w-[170px]"
            />

            <FilterCombobox
              value={statusFilter}
              onChange={setStatusFilter}
              options={filterOptions.statuses}
              allLabel="All Statuses"
              placeholder="Status"
              width="w-[150px]"
            />

            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
              >
                <X className="h-3 w-3" />
                Clear ({activeFilterCount})
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-lg font-medium">No opportunities found</p>
              <p className="text-sm mt-1">Try a different search or filter</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
    </div>
  );
}
