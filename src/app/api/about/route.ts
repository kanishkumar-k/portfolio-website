import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

// Helper to get the about.json path
function getJsonPath() {
  return path.join(process.cwd(), "data", "about.json");
}

export async function GET(req: NextRequest) {
  const jsonPath = getJsonPath();
  let data = {
    description: "Write about yourself here.",
    textColor: "#23272f"
  };
  if (fs.existsSync(jsonPath)) {
    const file = fs.readFileSync(jsonPath, "utf-8");
    data = JSON.parse(file);
  }
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  return NextResponse.json(
    { error: "Direct file writes are not supported in production. Use /api/github-update." },
    { status: 405 }
  );
}
