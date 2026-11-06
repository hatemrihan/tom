"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import Stepper from "@/components/Stepper";
import { cn } from "@/lib/utils";
import {
  LIMITS,
  PROJECT_TYPES,
  projectTypeLabel,
  validateContact,
  type ContactInput,
  type FieldErrors,
} from "@/lib/contact";
import hatemImage from "../../public/images/hatem-image.jpg";

const EMPTY: Required<ContactInput> = {
  name: "",
  email: "",
  phone: "",
  companyName: "",
  projectType: "",
  message: "",
};

const STEP_FIELDS: (keyof ContactInput)[][] = [
  ["name", "email", "phone"],
  ["companyName", "projectType", "message"],
  [],
];

export function ContactForm() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [honeypot, setHoneypot] = useState("");
  const [busy, setBusy] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const set = (field: keyof ContactInput) => (value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const validateStep = (step: number) => {
    const all = validateContact(form);
    const relevant = Object.fromEntries(
      Object.entries(all).filter(([k]) => STEP_FIELDS[step].includes(k as keyof ContactInput))
    ) as FieldErrors;
    setErrors(relevant);
    if (Object.keys(relevant).length > 0) {
      // Move focus to the first invalid field.
      const first = Object.keys(relevant)[0];
      requestAnimationFrame(() => document.getElementById(`contact-${first}`)?.focus());
      return false;
    }
    return true;
  };

  const submit = async () => {
    const all = validateContact(form);
    if (Object.keys(all).length > 0) {
      setErrors(all);
      setServerError("Some details need another look — go back a step to fix them.");
      return;
    }
    setBusy(true);
    setServerError(null);
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
    setFormKey((k) => k + 1);
  };

  return (
    <div className="relative">
      {/* Honeypot — hidden from humans and assistive tech */}
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

      <AnimatePresence mode="wait" initial={false}>
        {sent ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="py-10"
            role="status"
          >
            <span className="mb-6 flex size-12 items-center justify-center rounded-full bg-[#3b4a6b] text-white">
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <motion.path
                  d="M5 13l4 4L19 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                />
              </svg>
            </span>
            <h2 className="font-sans text-3xl tracking-tight text-[#3b4a6b] md:text-4xl">
              Thanks, {form.name.split(" ")[0] || "friend"}.
            </h2>
            <p className="mt-3 max-w-md font-sans text-[15px] leading-relaxed text-[#3b4a6b]/70">
              Your message landed safely. I usually reply within 24 hours at{" "}
              <span className="text-[#3b4a6b]">{form.email}</span>.
            </p>
            <button
              onClick={reset}
              className="mt-8 text-sm uppercase tracking-[0.14em] text-[#3b4a6b]/60 underline-offset-4 transition hover:text-[#3b4a6b] hover:underline"
            >
              Send another message
            </button>
          </motion.div>
        ) : (
          <motion.div key={`form-${formKey}`} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
            <Stepper
              busy={busy}
              onBeforeNext={validateStep}
              onComplete={submit}
              onStepChange={() => setServerError(null)}
              completeLabel="Send message"
              steps={[
                {
                  title: "You",
                  content: (
                    <div className="space-y-10">
                      <Field n={1} label="Name" required error={errors.name} id="contact-name">
                        <input
                          id="contact-name"
                          autoComplete="name"
                          value={form.name}
                          maxLength={LIMITS.name}
                          onChange={(e) => set("name")(e.target.value)}
                          placeholder="Your name"
                          className={inputClass(errors.name)}
                        />
                      </Field>
                      <Field n={2} label="Email" required error={errors.email} id="contact-email">
                        <input
                          id="contact-email"
                          type="email"
                          inputMode="email"
                          autoComplete="email"
                          value={form.email}
                          maxLength={LIMITS.email}
                          onChange={(e) => set("email")(e.target.value)}
                          placeholder="Your email address"
                          className={inputClass(errors.email)}
                        />
                      </Field>
                      <Field n={3} label="Phone" hint="Optional — WhatsApp works" error={errors.phone} id="contact-phone">
                        <input
                          id="contact-phone"
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          value={form.phone}
                          maxLength={LIMITS.phone}
                          onChange={(e) => set("phone")(e.target.value)}
                          placeholder="+20 100 000 0000"
                          className={inputClass(errors.phone)}
                        />
                      </Field>
                    </div>
                  ),
                },
                {
                  title: "Project",
                  content: (
                    <div className="space-y-10">
                      <Field n={4} label="Project type" required error={errors.projectType} id="contact-projectType">
                        <ProjectTypePicker
                          value={form.projectType}
                          onChange={set("projectType")}
                          invalid={Boolean(errors.projectType)}
                        />
                      </Field>
                      <Field n={5} label="Company" hint="Optional" error={errors.companyName} id="contact-companyName">
                        <input
                          id="contact-companyName"
                          autoComplete="organization"
                          value={form.companyName}
                          maxLength={LIMITS.companyName}
                          onChange={(e) => set("companyName")(e.target.value)}
                          placeholder="Where you work"
                          className={inputClass(errors.companyName)}
                        />
                      </Field>
                      <Field n={6} label="Message / Inquiries" error={errors.message} id="contact-message">
                        <textarea
                          id="contact-message"
                          rows={4}
                          value={form.message}
                          maxLength={LIMITS.message}
                          onChange={(e) => set("message")(e.target.value)}
                          placeholder="Write your message or inquiry here…"
                          className={cn(inputClass(errors.message), "resize-y")}
                        />
                      </Field>
                    </div>
                  ),
                },
                {
                  title: "Review",
                  content: (
                    <div className="grid gap-8 sm:grid-cols-[180px_1fr] sm:items-start">
                      <div className="relative overflow-hidden rounded-xl">
                        <Image
                          src={hatemImage}
                          alt="Hatem"
                          placeholder="blur"
                          sizes="180px"
                          className="aspect-[4/5] w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-[#3b4a6b]/60">Almost there</p>
                        <p className="mt-2 font-sans text-[15px] leading-relaxed text-[#3b4a6b]/80">
                          Hire him! If you don&apos;t, he&apos;ll know anyway — he knows everyone who visits his
                          website. Gotcha.
                        </p>
                        <dl className="mt-6 divide-y divide-[#3b4a6b]/10 border-y border-[#3b4a6b]/10 font-sans text-sm">
                          <Summary label="Name" value={form.name} />
                          <Summary label="Email" value={form.email} />
                          <Summary label="Phone" value={form.phone} />
                          <Summary label="Project" value={projectTypeLabel(form.projectType)} />
                          <Summary label="Company" value={form.companyName} />
                          <Summary label="Message" value={form.message} />
                        </dl>
                        {serverError && (
                          <p role="alert" className="mt-4 font-sans text-sm text-red-600">
                            {serverError}
                          </p>
                        )}
                      </div>
                    </div>
                  ),
                },
              ]}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function inputClass(error?: string) {
  return cn(
    "w-full border-0 border-b bg-transparent pb-3 pt-1 font-sans text-lg text-[#3b4a6b] outline-none transition-colors",
    "placeholder:text-[#3b4a6b]/35 focus:border-[#3b4a6b]",
    error ? "border-red-500" : "border-[#3b4a6b]/25"
  );
}

function Field({
  n,
  label,
  required,
  hint,
  error,
  id,
  children,
}: {
  n: number;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  id: string;
  children: React.ReactNode;
}) {
  const errorId = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-4 flex items-baseline justify-between gap-4">
        <span className="text-[13px] uppercase tracking-[0.2em] text-[#3b4a6b]">
          {n}. {label}
          {required && " *"}
        </span>
        {hint && <span className="font-sans text-xs text-[#3b4a6b]/45">{hint}</span>}
      </label>
      <div aria-describedby={error ? errorId : undefined}>{children}</div>
      <AnimatePresence>
        {error && (
          <motion.p
            id={errorId}
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="pt-2 font-sans text-sm text-red-600"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProjectTypePicker({
  value,
  onChange,
  invalid,
}: {
  value: string;
  onChange: (v: string) => void;
  invalid: boolean;
}) {
  return (
    <div id="contact-projectType" role="radiogroup" tabIndex={-1} className="flex flex-wrap gap-2 outline-none">
      {PROJECT_TYPES.map((p) => {
        const active = value === p.value;
        return (
          <button
            key={p.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(p.value)}
            className={cn(
              "rounded-full border px-4 py-2 font-sans text-sm transition-all active:scale-[0.97]",
              active
                ? "border-[#3b4a6b] bg-[#3b4a6b] text-white"
                : invalid
                  ? "border-red-300 text-[#3b4a6b]/80 hover:border-[#3b4a6b]/60"
                  : "border-[#3b4a6b]/20 text-[#3b4a6b]/80 hover:border-[#3b4a6b]/60"
            )}
          >
            {p.label}
          </button>
        );
      })}
    </div>
  );
}

function Summary({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex gap-4 py-2.5">
      <dt className="w-20 shrink-0 text-[#3b4a6b]/50">{label}</dt>
      <dd className="min-w-0 flex-1 whitespace-pre-wrap break-words text-[#3b4a6b]">
        {value?.trim() ? value : <span className="text-[#3b4a6b]/30">—</span>}
      </dd>
    </div>
  );
}
