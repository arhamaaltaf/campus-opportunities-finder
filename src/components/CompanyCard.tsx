import { Building2, ExternalLink, MapPin } from "lucide-react";
import { Company } from "@/lib/types";

interface CompanyCardProps {
  company: Company;
}

export function CompanyCard({ company }: CompanyCardProps) {
  const { name, website, industry, location, notes } = company;

  return (
    <div className="group bg-card border border-border rounded-xl p-5 hover:shadow-md hover:border-primary/20 transition-all duration-200">
      <div className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-muted-foreground bg-secondary px-2.5 py-0.5 rounded-full">
            {industry}
          </span>
        </div>

        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-bold text-foreground text-lg leading-tight flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary shrink-0" />
              {name}
            </h3>
            {location && (
              <p className="text-muted-foreground text-xs mt-1 flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {location}
              </p>
            )}
          </div>
        </div>

        {notes && (
          <p className="text-sm text-muted-foreground leading-relaxed">{notes}</p>
        )}

        {website && (
          <a
            href={website.startsWith("http") ? website : `https://${website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            Visit Website
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}
