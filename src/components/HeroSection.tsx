import { Link } from "react-router-dom";

interface HeroSectionProps {
  totalCount: number;
  openCount: number;
}

export function HeroSection({ totalCount, openCount }: HeroSectionProps) {
  return (
    <section className="pt-20 pb-12 px-4">
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm font-medium">
          <span className="w-2 h-2 rounded-full bg-status-open animate-pulse" />
          {openCount} open positions
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
          Find Your Next
          <span className="text-primary"> Opportunity</span>
        </h1>

        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          A curated list of internships, brand ambassador roles, and management trainee programs — updated regularly for our batch.
        </p>

        <p className="text-sm text-muted-foreground">
          Tracking {totalCount} opportunities across top companies
        </p>
      </div>
    </section>
  );
}
