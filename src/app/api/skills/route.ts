import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

function getJsonPath() {
  return path.join(process.cwd(), "data", "skills.json");
}

export async function GET() {
  const jsonPath = getJsonPath();
  let data: any[] = [];
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
