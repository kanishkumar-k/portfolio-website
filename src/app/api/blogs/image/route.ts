import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

/**
 * Handles image upload for blogs.
 * Accepts a multipart/form-data POST request with an image file and a title.
 * Saves the image to the public/images directory with a filename based on the blog title.
 * Returns the image path.
 */
export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const file = formData.get("image");
    const title = (formData.get("title") as string) || "blog";
    if (!file || typeof file !== "object" || !("arrayBuffer" in file)) {
        return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const imagesDir = path.join(process.cwd(), "public", "images");
    if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir, { recursive: true });
    }
    const ext = (file.name || "img").split(".").pop();
    let baseName = title.toLowerCase().replace(/[^a-z0-9]/gi, "_");
    const filename = `${baseName}.${ext}`;
    const filePath = path.join(imagesDir, filename);
    fs.writeFileSync(filePath, buffer);
    const imagePath = `/images/${filename}`;

    return NextResponse.json({ image: imagePath });
}
