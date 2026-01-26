import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

/**
 * GET /api/education
 * Returns the education data from data/education.json.
 */
export async function GET() {
  const filePath = path.join(process.cwd(), "data", "education.json");
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    const education = JSON.parse(data);
    return NextResponse.json(education);
  } catch (error) {
    return NextResponse.json({ error: "Unable to load education data." }, { status: 500 });
  }
}
