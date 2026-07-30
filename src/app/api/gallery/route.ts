import { readdir } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);

async function readImagesFrom(relativeDir: string, publicPathPrefix: string) {
  const dir = path.join(process.cwd(), "public", relativeDir);

  try {
    const entries = await readdir(dir, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase()))
      .map((entry) => ({
        name: entry.name,
        src: `${publicPathPrefix}/${entry.name}`.replace(/\/+/g, "/"),
      }));
  } catch {
    return [];
  }
}

export async function GET() {
  const folderImages = await readImagesFrom("gallery", "/gallery");
  const rootImages = (await readImagesFrom("", "")).filter((image) =>
    image.name.toLowerCase().startsWith("gallery-")
  );

  return NextResponse.json([...folderImages, ...rootImages]);
}
