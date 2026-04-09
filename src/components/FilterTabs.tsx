import { cn } from "@/lib/utils";

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Internships", value: "Internship" },
  { label: "Brand Ambassador", value: "Brand Ambassador" },
  { label: "MT Programs", value: "MT" },
] as const;

interface FilterTabsProps {
  active: string;
  onChange: (value: string) => void;
  counts: Record<string, number>;
}

export function FilterTabs({ active, onChange, counts }: FilterTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((f) => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all",
            active === f.value
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-card text-muted-foreground hover:text-foreground hover:bg-secondary border border-border"
          )}
        >
          {f.label}
          <span className={cn(
            "ml-2 text-xs",
            active === f.value ? "text-primary-foreground/70" : "text-muted-foreground"
          )}>
            {counts[f.value] ?? 0}
          </span>
        </button>
      ))}
    </div>
  );
}
