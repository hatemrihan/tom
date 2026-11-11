"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";
import { LIMITS, validateContact, type ContactInput, type FieldErrors } from "@/lib/contact";

const EMPTY: Required<Omit<ContactInput, "projectType">> = {
  name: "",
  email: "",
  phone: "",
  companyName: "",
  message: "",
};

/** The order fields appear in, so focus can go to the first one with a problem. */
const ORDER: (keyof ContactInput)[] = ["name", "email", "phone", "companyName", "message"];

/**
 * One short page instead of steps: five fields, one button. Validation and the
 * request are the same as before.
 */
export function ContactForm() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [honeypot, setHoneypot] = useState("");
  const [busy, setBusy] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const set = (field: keyof ContactInput) => (value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy) return;
    const found = validateContact(form);
    setErrors(found);
    setServerError(null);
    const first = ORDER.find((field) => found[field]);
    if (first) {
      document.getElementById(`contact-${first}`)?.focus();
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, website: honeypot }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Couldn't send your message.");
      setSent(true);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Couldn't send your message.");
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    setForm(EMPTY);
    setErrors({});
    setSent(false);
    setServerError(null);
  };

  if (sent) {
    return (
      <div role="status" className="text-center">
        <p>
          Thanks, {form.name.trim().split(" ")[0] || "friend"}. Your message is with me.
          <br />
          <span className="font-normal text-neutral-500">I usually reply within a day, to {form.email}</span>
        </p>
        <button type="button" onClick={reset} className="mt-6 cursor-pointer uppercase underline-offset-4 hover:underline">
          Send another ↗
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="relative space-y-8">
      {/* Honeypot: hidden from people and assistive tech */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      <div className="grid gap-8 sm:grid-cols-2">
        <Field label="Name" id="contact-name" error={errors.name}>
          {(described) => (
            <input
              id="contact-name"
              autoComplete="name"
              value={form.name}
              maxLength={LIMITS.name}
              onChange={(e) => set("name")(e.target.value)}
              placeholder="Your name"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={described}
              className={inputClass(errors.name)}
            />
          )}
        </Field>
        <Field label="Email" id="contact-email" error={errors.email}>
          {(described) => (
            <input
              id="contact-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={form.email}
              maxLength={LIMITS.email}
              onChange={(e) => set("email")(e.target.value)}
              placeholder="you@company.com"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={described}
              className={inputClass(errors.email)}
            />
          )}
        </Field>
        <Field label="Phone" hint="Optional" id="contact-phone" error={errors.phone}>
          {(described) => (
            <input
              id="contact-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={form.phone}
              maxLength={LIMITS.phone}
              onChange={(e) => set("phone")(e.target.value)}
              placeholder="WhatsApp works"
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={described}
              className={inputClass(errors.phone)}
            />
          )}
        </Field>
        <Field label="Company" hint="Optional" id="contact-companyName" error={errors.companyName}>
          {(described) => (
            <input
              id="contact-companyName"
              autoComplete="organization"
              value={form.companyName}
              maxLength={LIMITS.companyName}
              onChange={(e) => set("companyName")(e.target.value)}
              placeholder="Where you work"
              aria-invalid={Boolean(errors.companyName)}
              aria-describedby={described}
              className={inputClass(errors.companyName)}
            />
          )}
        </Field>
      </div>

      <Field label="Message" id="contact-message" error={errors.message}>
        {(described) => (
          <textarea
            id="contact-message"
            rows={4}
            value={form.message}
            maxLength={LIMITS.message}
            onChange={(e) => set("message")(e.target.value)}
            placeholder="What are you building, and by when?"
            aria-invalid={Boolean(errors.message)}
            aria-describedby={described}
            className={cn(inputClass(errors.message), "resize-y")}
          />
        )}
      </Field>

      <div className="flex items-center justify-between gap-6">
        <p role="alert" className="font-normal normal-case text-red-600">
          {serverError}
        </p>
        <button
          type="submit"
          disabled={busy}
          className="shrink-0 cursor-pointer bg-neutral-900 px-5 py-2.5 uppercase text-white transition-opacity hover:opacity-80 disabled:cursor-default disabled:opacity-50"
        >
          {busy ? "Sending" : "Send ↗"}
        </button>
      </div>
    </form>
  );
}

function inputClass(error?: string) {
  return cn(
    "w-full rounded-none border-0 border-b bg-transparent pb-2 pt-1 text-[16px] font-normal normal-case tracking-normal text-neutral-900 outline-none transition-colors sm:text-[14px]",
    "placeholder:text-neutral-400 focus:border-neutral-900",
    error ? "border-red-500" : "border-neutral-300",
  );
}

function Field({
  label,
  hint,
  error,
  id,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  id: string;
  children: (describedBy: string | undefined) => React.ReactNode;
}) {
  const errorId = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-2 flex justify-between gap-4">
        <span>{label}</span>
        {hint && <span className="font-normal text-neutral-400">{hint}</span>}
      </label>
      {children(error ? errorId : undefined)}
      {error && (
        <p id={errorId} role="alert" className="pt-2 font-normal normal-case text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
