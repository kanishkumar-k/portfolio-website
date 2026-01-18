import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

function getJsonPath() {
  return path.join(process.cwd(), "data", "blogs.json");
}

export async function GET(req: NextRequest) {
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

  // Check if the request is multipart/form-data (file upload)
  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();
    const blogData = JSON.parse(formData.get("data") as string);
    let imagePath = blogData.image || "";

    // Handle file upload
    const file = formData.get("image");
    if (file && typeof file === "object" && "arrayBuffer" in file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const imagesDir = path.join(process.cwd(), "public", "images");
      if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir, { recursive: true });
      }
      const ext = (file.name || "img").split(".").pop();
      const filename = `blog_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const filePath = path.join(imagesDir, filename);
      fs.writeFileSync(filePath, buffer);
      imagePath = `/images/${filename}`;
    }

    // Update the blog data with the image path
    blogData.image = imagePath;

    // Read existing blogs, update or add this one
    let blogs = [];
    if (fs.existsSync(jsonPath)) {
      blogs = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
    }
    // If blogData has an id, update; else, add new
    if (blogData.id) {
      blogs = blogs.map((b: any) => (b.id === blogData.id ? blogData : b));
    } else {
      // Assign a new id
      blogData.id = Date.now();
      blogs.push(blogData);
    }
    // --- GITHUB API LOGIC START ---
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
    if (!GITHUB_TOKEN) {
      return NextResponse.json({ error: "GitHub token not set" }, { status: 500 });
    }
    const filePath = "data/blogs.json";
    const sha = await getFileSha(filePath);
    const content = Buffer.from(JSON.stringify(blogs, null, 2)).toString("base64");
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
        body: JSON.stringify({
          message: "Update blogs.json via API",
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
    return NextResponse.json(blogData);
  } else {
    // Fallback: handle JSON array (legacy)
    const data = await req.json();
    try {
      // --- GITHUB API LOGIC START ---
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
      if (!GITHUB_TOKEN) {
        return NextResponse.json({ error: "GitHub token not set" }, { status: 500 });
      }
      const filePath = "data/blogs.json";
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
            message: "Update blogs.json via API",
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
      return NextResponse.json(data);
    } catch (error) {
      console.error("Failed to write blogs.json:", error);
      return NextResponse.json(
        { error: "Failed to write blogs.json", details: String(error) },
        { status: 500 }
      );
    }
  }
}
