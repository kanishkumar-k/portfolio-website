import { NextRequest, NextResponse } from "next/server";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Set this in your Vercel/Netlify env vars
const GITHUB_REPO = "kanishkumar-k/portfolio-website";   // Set your repo here
const GITHUB_BRANCH = "main";                  // Set your branch here

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
  const { filePath, json, commitMessage } = await req.json();
  if (!filePath || !json) {
    return NextResponse.json({ error: "Missing filePath or json" }, { status: 400 });
  }
  const sha = await getFileSha(filePath);
  const content = Buffer.from(JSON.stringify(json, null, 2)).toString("base64");

  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`,
    {
      method: "PUT",
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
      body: JSON.stringify({
        message: commitMessage || `Update ${filePath} via admin`,
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

  const data = await res.json();
  return NextResponse.json({ success: true, data });
}
