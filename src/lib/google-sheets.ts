import { Opportunity, OpportunityCategory } from "./types";

const CATEGORY_MAP: Record<string, OpportunityCategory> = {
  internship: "Internship",
  "brand ambassador": "Brand Ambassador",
  mt: "MT",
  "management trainee": "MT",
};

function parseCategory(raw: string): OpportunityCategory {
  const lower = raw.trim().toLowerCase();
  return CATEGORY_MAP[lower] ?? "Internship";
}

/**
 * Fetches data from a published Google Sheet.
 * 
 * To use this:
 * 1. Open your Google Sheet
 * 2. File → Share → Publish to web → select "Sheet1" → publish as CSV
 * 3. Copy the URL and set it as VITE_GOOGLE_SHEET_CSV_URL in your .env
 * 
 * Expected columns: Company, Role, Category, Status, Deadline, Link, Location
 */
export async function fetchOpportunities(csvUrl: string): Promise<Opportunity[]> {
  const res = await fetch(csvUrl);
  if (!res.ok) throw new Error("Failed to fetch sheet data");
  
  const text = await res.text();
  const rows = parseCSV(text);
  
  if (rows.length < 2) return [];
  
  const headers = rows[0].map((h) => h.trim().toLowerCase());
  const colIndex = (name: string) => headers.indexOf(name);

  return rows.slice(1).filter(row => row.some(cell => cell.trim())).map((row, i) => {
    const get = (col: string) => row[colIndex(col)]?.trim() ?? "";
    const status = get("status").toLowerCase().includes("open") && !get("status").toLowerCase().includes("not")
      ? "Open" : "Not Yet Open";

    return {
      id: String(i),
      company: get("company") || "Unknown",
      role: get("role") || get("position") || "—",
      category: parseCategory(get("category") || get("type") || ""),
      status,
      deadline: status === "Open" ? (get("deadline") || null) : null,
      link: status === "Open" ? (get("link") || get("url") || null) : null,
      location: get("location") || undefined,
    };
  });
}

function parseCSV(text: string): string[][] {
  const lines: string[][] = [];
  let current: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"' && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cell += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        current.push(cell);
        cell = "";
      } else if (ch === "\n" || (ch === "\r" && text[i + 1] === "\n")) {
        current.push(cell);
        cell = "";
        lines.push(current);
        current = [];
        if (ch === "\r") i++;
      } else {
        cell += ch;
      }
    }
  }
  if (cell || current.length) {
    current.push(cell);
    lines.push(current);
  }
  return lines;
}

// Mock data for demo when no sheet is connected
export function getMockOpportunities(): Opportunity[] {
  return [
    { id: "1", company: "Unilever", role: "Summer Internship 2025", category: "Internship", status: "Open", deadline: "May 15, 2025", link: "https://careers.unilever.com", location: "Karachi" },
    { id: "2", company: "Nestlé", role: "Management Trainee Program", category: "MT", status: "Open", deadline: "June 1, 2025", link: "https://careers.nestle.com", location: "Lahore" },
    { id: "3", company: "Coca-Cola", role: "Brand Ambassador", category: "Brand Ambassador", status: "Not Yet Open", deadline: null, link: null, location: "Islamabad" },
    { id: "4", company: "P&G", role: "Finance Intern", category: "Internship", status: "Open", deadline: "April 30, 2025", link: "https://pgcareers.com", location: "Karachi" },
    { id: "5", company: "L'Oréal", role: "Marketing Intern", category: "Internship", status: "Not Yet Open", deadline: null, link: null },
    { id: "6", company: "Engro", role: "Management Trainee 2025", category: "MT", status: "Open", deadline: "May 20, 2025", link: "https://engro.com/careers", location: "Karachi" },
    { id: "7", company: "Jazz", role: "Campus Ambassador", category: "Brand Ambassador", status: "Open", deadline: "April 25, 2025", link: "https://jazz.com.pk/careers" },
    { id: "8", company: "HBL", role: "Summer Internship", category: "Internship", status: "Open", deadline: "May 10, 2025", link: "https://hbl.com/careers", location: "Multiple" },
    { id: "9", company: "Telenor", role: "Graduate Trainee Program", category: "MT", status: "Not Yet Open", deadline: null, link: null, location: "Islamabad" },
    { id: "10", company: "Shell", role: "Technical Intern", category: "Internship", status: "Open", deadline: "June 15, 2025", link: "https://shell.com/careers", location: "Karachi" },
  ];
}
