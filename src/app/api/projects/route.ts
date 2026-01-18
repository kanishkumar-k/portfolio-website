import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

function getJsonPath() {
  return path.join(process.cwd(), "data", "projects.json");
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
    const projectData = JSON.parse(formData.get("data") as string);
    let imagePath = projectData.image || "";

    // Handle file upload
    const file = formData.get("image");
    if (file && typeof file === "object" && "arrayBuffer" in file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const imagesDir = path.join(process.cwd(), "public", "images");
      if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir, { recursive: true });
      }
      const ext = (file.name || "img").split(".").pop();
      // Sanitize project name for filename
      let baseName = (projectData.title || "project").toLowerCase().replace(/[^a-z0-9]/gi, "_");
      const filename = `${baseName}.${ext}`;
      const filePath = path.join(imagesDir, filename);
      fs.writeFileSync(filePath, buffer);
      imagePath = `/images/${filename}`;
    }

    // Update the project data with the image path
    projectData.image = imagePath;
    // Remove transient fields
    delete projectData.imagePreview;
    delete projectData.imageFile;

    // Read existing projects, update or add this one
    let projects = [];
    if (fs.existsSync(jsonPath)) {
      projects = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
    }
    // If projectData has an id, update; else, add new
    if (projectData.id) {
      projects = projects.map((p: any) => (p.id === projectData.id ? projectData : p));
    } else {
      // Assign a new id
      projectData.id = Date.now();
      projects.push(projectData);
    }
    fs.writeFileSync(jsonPath, JSON.stringify(projects, null, 2), "utf-8");
    return NextResponse.json(projectData);
  } else {
    // Fallback: handle JSON array (legacy)
    const data = await req.json();
    try {
      // Remove transient fields from all projects before saving
      const cleaned = Array.isArray(data)
        ? data.map((p: any) => {
            const { imagePreview, imageFile, ...rest } = p;
            return rest;
          })
        : data;
      fs.writeFileSync(jsonPath, JSON.stringify(cleaned, null, 2), "utf-8");
      return NextResponse.json(cleaned);
    } catch (error) {
      console.error("Failed to write projects.json:", error);
      return NextResponse.json(
        { error: "Failed to write projects.json", details: String(error) },
        { status: 500 }
      );
    }
  }
}
