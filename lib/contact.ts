export const CONTACT_STATUSES = ["unread", "read", "responded", "archived"] as const;
export type ContactStatus = (typeof CONTACT_STATUSES)[number];

export const PROJECT_TYPES = [
  { value: "web-design", label: "Web design" },
  { value: "web-development", label: "AI website / Automation" },
  { value: "branding", label: "Portfolio" },
  { value: "e-commerce", label: "E‑commerce" },
  { value: "other", label: "Something custom" },
] as const;

export type ProjectType = (typeof PROJECT_TYPES)[number]["value"];

export function projectTypeLabel(value?: string | null): string {
  if (!value) return "—";
  return PROJECT_TYPES.find((p) => p.value === value)?.label ?? value;
}

export interface ContactInput {
  name: string;
  email: string;
  phone?: string;
  companyName?: string;
  projectType?: string;
  message?: string;
}

/** Shape returned to the admin dashboard (ids/dates serialised). */
export interface ContactRecord {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  companyName: string | null;
  projectType: string | null;
  message: string | null;
  status: ContactStatus;
  source: string;
  submittedAt: string;
  updatedAt?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const LIMITS = {
  name: 120,
  email: 200,
  phone: 40,
  companyName: 160,
  message: 5000,
} as const;

export type FieldErrors = Partial<Record<keyof ContactInput, string>>;

/** Validation shared by the client form and the API route. */
export function validateContact(input: Partial<ContactInput>): FieldErrors {
  const errors: FieldErrors = {};
  const name = input.name?.trim() ?? "";
  const email = input.email?.trim() ?? "";

  if (!name) errors.name = "Please tell me your name.";
  else if (name.length > LIMITS.name) errors.name = "That name is a little long.";

  if (!email) errors.email = "An email is needed so I can reply.";
  else if (!EMAIL_RE.test(email) || email.length > LIMITS.email)
    errors.email = "That email doesn't look right.";

  if (input.phone && input.phone.trim().length > LIMITS.phone)
    errors.phone = "Phone number is too long.";
  if (input.phone && input.phone.trim() && !/^[+()\d\s.-]{5,}$/.test(input.phone.trim()))
    errors.phone = "Use digits, spaces and + only.";

  if (input.companyName && input.companyName.length > LIMITS.companyName)
    errors.companyName = "Company name is too long.";

  if (!input.projectType) errors.projectType = "Pick the closest project type.";
  else if (!PROJECT_TYPES.some((p) => p.value === input.projectType))
    errors.projectType = "Unknown project type.";

  if (input.message && input.message.length > LIMITS.message)
    errors.message = `Keep it under ${LIMITS.message} characters.`;

  return errors;
}

/** A row of the Supabase `contacts` table. */
export interface ContactRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company_name: string | null;
  project_type: string | null;
  message: string | null;
  status: ContactStatus;
  source: string;
  submitted_at: string;
  updated_at: string | null;
}

export function toContactRecord(row: ContactRow): ContactRecord {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    companyName: row.company_name,
    projectType: row.project_type,
    message: row.message,
    status: row.status,
    source: row.source,
    submittedAt: row.submitted_at,
    updatedAt: row.updated_at ?? undefined,
  };
}
