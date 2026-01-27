import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { from, subject, body } = await req.json();

    if (!from || !subject || !body) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Use environment variables for security
    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_APP_PASSWORD;
    const to = process.env.GMAIL_TO || user;

    if (!user || !pass || !to) {
      return NextResponse.json({ error: "Email configuration missing" }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user,
        pass,
      },
    });

    await transporter.sendMail({
      from: user,
      to,
      replyTo: from,
      subject,
      text: `Sender Email: ${from}\n\n${body}`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
