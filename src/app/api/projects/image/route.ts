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
  const file = formData.get("image");
  const title = formData.get("title") as string || "project";
  if (!file || typeof file !== "object" || !("arrayBuffer" in file)) {
    return NextResponse.json({ error: "No image file provided" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = (file.name || "img").split(".").pop();
  let baseName = title.toLowerCase().replace(/[^a-z0-9]/gi, "_");
  const filename = `${baseName}.${ext}`;
  const githubPath = `public/images/${filename}`;
  const imagePath = `/images/${filename}`;

  if (!GITHUB_TOKEN) {
    return NextResponse.json({ error: "GitHub token not set" }, { status: 500 });
  }

  const sha = await getFileSha(githubPath);
  const content = buffer.toString("base64");

  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/contents/${githubPath}`,
    {
      method: "PUT",
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
      body: JSON.stringify({
        message: "Upload project image via API",
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

  return NextResponse.json({ image: imagePath });
}
