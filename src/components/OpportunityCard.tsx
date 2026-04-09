import { Bookmark, Calendar, ExternalLink, MapPin } from "lucide-react";
import { Opportunity } from "@/lib/types";
import { cn } from "@/lib/utils";

interface OpportunityCardProps {
  opportunity: Opportunity;
  isBookmarked?: boolean;
  onToggleBookmark?: (id: string) => void;
}

export function OpportunityCard({ opportunity, isBookmarked, onToggleBookmark }: OpportunityCardProps) {
  const { companyName, role, category, status, deadline, link, location } = opportunity;
  const isOpen = status === "Open";

  return (
    <div className="group bg-card border border-border rounded-xl p-5 hover:shadow-md hover:border-primary/20 transition-all duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn(
              "inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full",
              isOpen
                ? "bg-status-open-bg text-status-open"
                : "bg-status-closed-bg text-status-closed"
            )}>
              <span className={cn("w-1.5 h-1.5 rounded-full", isOpen ? "bg-status-open" : "bg-status-closed")} />
              {status}
            </span>
            <span className="text-xs font-medium text-muted-foreground bg-secondary px-2.5 py-0.5 rounded-full">
              {category}
            </span>
          </div>

          <div>
            <h3 className="font-bold text-foreground text-lg leading-tight">{company}</h3>
            <p className="text-muted-foreground text-sm mt-0.5">{role}</p>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {deadline && (
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {deadline}
              </span>
            )}
            {location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {location}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 shrink-0">
          {onToggleBookmark && (
            <button
              onClick={() => onToggleBookmark(opportunity.id)}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
              aria-label={isBookmarked ? "Remove bookmark" : "Bookmark"}
            >
              <Bookmark
                className={cn("h-4 w-4", isBookmarked ? "fill-primary text-primary" : "text-muted-foreground")}
              />
            </button>
          )}
        </div>
      </div>

      {isOpen && link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          Apply Now
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      )}
    </div>
  );
}
