import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

// Helper to get the contact.json path
function getJsonPath() {
  return path.join(process.cwd(), "data", "contact.json");
}

export async function GET() {
  const jsonPath = getJsonPath();
  let data = {
    email: "",
    phone: "",
    linkedin: "",
    github: "",
    textColor: "#23272f"
  };
  if (fs.existsSync(jsonPath)) {
    const file = fs.readFileSync(jsonPath, "utf-8");
    data = JSON.parse(file);
  }
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const jsonPath = getJsonPath();
  const data = await req.json();
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), "utf-8");
  return NextResponse.json(data);
}
