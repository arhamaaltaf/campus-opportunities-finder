export type OpportunityCategory = "Internship" | "Brand Ambassador" | "MT";

export interface Opportunity {
  id: string;
  company: string;
  role: string;
  category: OpportunityCategory;
  status: "Open" | "Not Yet Open";
  deadline: string | null;
  link: string | null;
  location?: string;
}
