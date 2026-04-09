export type OpportunityCategory = "Internship" | "Brand Ambassador" | "MT" | "Management Trainee";

export interface Company {
  id: string;
  name: string;
  website: string;
  industry: string;
  location: string;
  notes: string;
}

export interface Opportunity {
  id: string;
  company: string;
  role: string;
  category: OpportunityCategory;
  status: "Open" | "Not Yet Open";
  deadline: string | null;
  link: string | null;
  location?: string;
  description?: string;
}
