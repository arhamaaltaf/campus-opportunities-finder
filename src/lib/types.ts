export type OpportunityCategory = "Internship" | "Brand Ambassador" | "MT" | "Management Trainee";

export interface Company {
  id: string;
  name: string;
  website: string;
  industry: string;
  location: string;
  notes: string;
  departments?: string[];
}

export interface Opportunity {
  id: string;
  companyId: string;
  companyName: string;
  role: string;
  category: string;
  status: string;
  deadline: string | null;
  link: string | null;
  location?: string;
  description?: string;
  industry?: string;
  departments?: string[];
}
