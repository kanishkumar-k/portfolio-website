import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

/**
 * GET /api/certifications
 * Returns the certifications data from data/certifications.json.
 */
export async function GET() {
  const filePath = path.join(process.cwd(), "data", "certifications.json");
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    const certifications = JSON.parse(data);
    return NextResponse.json(certifications);
  } catch (error) {
    return NextResponse.json({ error: "Unable to load certifications data." }, { status: 500 });
  }
}
