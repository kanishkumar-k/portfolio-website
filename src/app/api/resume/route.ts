import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const resumePath = path.join(process.cwd(), "public", "kanishkumar-resume.pdf");
  fs.writeFileSync(resumePath, buffer);

  return NextResponse.json({ success: true, path: "/kanishkumar-resume.pdf" });
}
