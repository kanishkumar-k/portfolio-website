import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

function getJsonPath() {
  return path.join(process.cwd(), "data", "experience.json");
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
  const jsonPath = getJsonPath();
  const data = await req.json(); // expects an array of experience objects
  try {
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), "utf-8");
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to write experience.json:", error);
    return NextResponse.json(
      { error: "Failed to write experience.json", details: String(error) },
      { status: 500 }
    );
  }
}
