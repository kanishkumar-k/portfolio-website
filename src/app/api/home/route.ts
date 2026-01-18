import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

// Helper to get the home.json path
function getJsonPath() {
  return path.join(process.cwd(), "data", "home.json");
}

export async function GET() {
  const jsonPath = getJsonPath();
  if (fs.existsSync(jsonPath)) {
    const file = fs.readFileSync(jsonPath, "utf-8");
    const data = JSON.parse(file);
    return NextResponse.json(data);
  }
  return NextResponse.json({});
}

export async function POST(req: NextRequest) {
  return NextResponse.json(
    { error: "Direct file writes are not supported in production. Use /api/github-update." },
    { status: 405 }
  );
}
