import { Company, Opportunity } from "./types";

function parseCSV(text: string): string[][] {
  const lines: string[][] = [];
  let current: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') { inQuotes = false; }
      else { cell += ch; }
    } else {
      if (ch === '"') { inQuotes = true; }
      else if (ch === ",") { current.push(cell); cell = ""; }
      else if (ch === "\n" || (ch === "\r" && text[i + 1] === "\n")) {
        current.push(cell); cell = ""; lines.push(current); current = [];
        if (ch === "\r") i++;
      } else { cell += ch; }
    }
  }
  if (cell || current.length) { current.push(cell); lines.push(current); }
  return lines;
}

function parseRows(csvUrl: string) {
  return fetch(csvUrl).then(r => { if (!r.ok) throw new Error("Fetch failed"); return r.text(); }).then(parseCSV);
}

export async function fetchCompanies(csvUrl: string): Promise<Company[]> {
  const rows = await parseRows(csvUrl);
  if (rows.length < 2) return [];
  const headers = rows[0].map(h => h.trim().toLowerCase());
  const col = (name: string) => headers.findIndex(h => h.includes(name));

  return rows.slice(1).filter(r => r.some(c => c.trim())).map(row => {
    const get = (name: string) => row[col(name)]?.trim() ?? "";
    return {
      id: get("company id") || get("id") || get("company name"),
      name: get("company name") || get("name") || "Unknown",
      website: get("website"),
      industry: get("industry"),
      location: get("location"),
      notes: get("notes"),
    } as Company;
  });
}

/**
 * If you add a second sheet tab for opportunities, publish it as CSV too 
 * and call this with that URL. Expected columns:
 * Company, Role, Category, Status, Deadline, Link, Location
 */
export async function fetchOpportunities(csvUrl: string): Promise<Opportunity[]> {
  const rows = await parseRows(csvUrl);
  if (rows.length < 2) return [];
  const headers = rows[0].map(h => h.trim().toLowerCase());
  const col = (name: string) => headers.findIndex(h => h.includes(name));

  return rows.slice(1).filter(r => r.some(c => c.trim())).map((row, i) => {
    const get = (name: string) => row[col(name)]?.trim() ?? "";
    return {
      id: get("opportunity id") || String(i),
      companyId: get("company id"),
      companyName: "",
      role: get("title (program name)") || get("title") || get("role") || "—",
      category: get("role type") || get("category") || "Internship",
      status: get("status") || "Open",
      deadline: get("deadline") || null,
      link: get("link to apply") || get("application link") || get("link") || null,
      location: get("location") || undefined,
      description: get("description") || undefined,
    };
  });
}

export function enrichOpportunities(opps: Opportunity[], companies: Company[]): Opportunity[] {
  const companyMap = new Map(companies.map(c => [c.id, c]));
  return opps.map(o => {
    const company = companyMap.get(o.companyId);
    return {
      ...o,
      companyName: company?.name || o.companyId,
      industry: company?.industry,
      departments: company?.departments,
    };
  });
}

export function getMockCompanies(): Company[] {
  return [];
}
