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

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = "kanishkumar-k/portfolio-website";
const GITHUB_BRANCH = "main";

async function getFileSha(path: string) {
  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}`,
    {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data.sha;
}

export async function POST(req: NextRequest) {
  if (!GITHUB_TOKEN) {
    return NextResponse.json({ error: "GitHub token not set" }, { status: 500 });
  }
  try {
    const data = await req.json();
    const filePath = "data/contact.json";
    const sha = await getFileSha(filePath);
    const content = Buffer.from(JSON.stringify(data, null, 2)).toString("base64");

    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
        body: JSON.stringify({
          message: "Update contact.json via API",
          content,
          branch: GITHUB_BRANCH,
          sha,
        }),
      }
    );

    if (!res.ok) {
      const error = await res.json();
      return NextResponse.json({ error }, { status: res.status });
    }

    const result = await res.json();
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update contact.json via GitHub", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
