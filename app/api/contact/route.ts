import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { clientIp, rateLimit } from "@/lib/admin-auth";
import { validateContact, type ContactInput } from "@/lib/contact";

export const dynamic = "force-dynamic";

const str = (value: unknown) => (typeof value === "string" ? value : undefined);

export async function POST(request: NextRequest) {
  const limit = rateLimit(`contact:${clientIp(request)}`, 5, 10 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "You've sent a few messages already — please try again in a bit." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Honeypot: real visitors never fill the hidden "website" field.
  if (str(body.website)) {
    return NextResponse.json({ success: true }, { status: 201 });
  }

  const input: ContactInput = {
    name: str(body.name) ?? "",
    email: str(body.email) ?? "",
    phone: str(body.phone),
    companyName: str(body.companyName),
    projectType: str(body.projectType),
    message: str(body.message),
  };

  const errors = validateContact(input);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { error: Object.values(errors)[0], fields: errors },
      { status: 400 }
    );
  }

  try {
    const { db } = await connectToDatabase();
    const result = await db.collection("contacts").insertOne({
      name: input.name.trim(),
      email: input.email.toLowerCase().trim(),
      phone: input.phone?.trim() || null,
      companyName: input.companyName?.trim() || null,
      projectType: input.projectType ?? null,
      message: input.message?.trim() || null,
      submittedAt: new Date(),
      status: "unread",
      source: "contact-stepper",
      userAgent: request.headers.get("user-agent")?.slice(0, 300) ?? null,
    });

    return NextResponse.json(
      { success: true, contactId: result.insertedId.toString() },
      { status: 201 }
    );
  } catch (error) {
    console.error("[contact] submission failed:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "Something went wrong on my side. Please email me directly." },
      { status: 500 }
    );
  }
}
