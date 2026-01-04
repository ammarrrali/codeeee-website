import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

type Body = {
  name: string;
  contact: string;
  message: string;
  pageUrl?: string;
};

function sanitize(s: string) {
  return (s || "").toString().trim().slice(0, 5000);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;

    const name = sanitize(body.name);
    const contact = sanitize(body.contact);
    const message = sanitize(body.message);
    const pageUrl = sanitize(body.pageUrl || "");

    if (!name || !contact || !message) {
      return NextResponse.json(
        { ok: false, error: "Missing fields" },
        { status: 400 }
      );
    }

    // --- SMTP ENV VARS ---
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || "587");
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    // where you receive the leads
    const to = process.env.LEADS_TO_EMAIL;
    const from = process.env.LEADS_FROM_EMAIL || user;

    if (!host || !user || !pass || !to || !from) {
      return NextResponse.json(
        { ok: false, error: "Email server not configured (.env.local missing)" },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for 587
      auth: { user, pass },
    });

    const subject = `CODEEEE | New Consultation Request — ${name}`;

    const text =
      `CODEEEE Consultation Request\n\n` +
      `Name: ${name}\n` +
      `Client Contact: ${contact}\n` +
      (pageUrl ? `Page: ${pageUrl}\n` : "") +
      `\nBrief:\n${message}\n`;

    await transporter.sendMail({
      from: `"CODEEEE Leads" <${from}>`,
      to,
      replyTo: to, // keep simple; can set to a real inbox
      subject,
      text,
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Failed to send email" },
      { status: 500 }
    );
  }
}