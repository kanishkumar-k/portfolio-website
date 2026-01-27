import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

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
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  if (!GITHUB_TOKEN) {
    return NextResponse.json({ error: "GitHub token not set" }, { status: 500 });
  }

  const filePath = "public/kanishkumar-resume.pdf";
  const sha = await getFileSha(filePath);
  const content = buffer.toString("base64");

  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`,
    {
      method: "PUT",
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
      body: JSON.stringify({
        message: "Update resume PDF via API",
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

  return NextResponse.json({ success: true, path: "/kanishkumar-resume.pdf" });
}
