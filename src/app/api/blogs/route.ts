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
    fs.writeFileSync(jsonPath, JSON.stringify(blogs, null, 2), "utf-8");
    return NextResponse.json(blogData);
  } else {
    // Fallback: handle JSON array (legacy)
    const data = await req.json();
    try {
      fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), "utf-8");
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
