import crypto from "crypto";

interface CloudinaryUploadResult {
  secure_url: string;
  resource_type?: string;
  original_filename?: string;
  format?: string;
}

export function getFileType(file: File) {
  const name = file.name.toLowerCase();

  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("audio/")) return "audio";
  if (file.type.startsWith("video/")) return "video";
  if (name.endsWith(".zip") || name.endsWith(".rar") || name.endsWith(".7z")) return "archive";
  if (
    file.type.includes("pdf") ||
    file.type.includes("document") ||
    file.type.includes("spreadsheet") ||
    file.type.includes("presentation") ||
    /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt|csv)$/i.test(name)
  ) {
    return "document";
  }

  return "file";
}

export async function uploadToCloudinary(file: File, folderSuffix = "shared-files") {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const baseFolder = process.env.CLOUDINARY_UPLOAD_FOLDER || "matt-dash";

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary environment variables are not configured");
  }

  const timestamp = Math.round(Date.now() / 1000).toString();
  const folder = `${baseFolder}/${folderSuffix}`;
  const signature = crypto
    .createHash("sha1")
    .update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`)
    .digest("hex");

  const uploadForm = new FormData();
  uploadForm.append("file", new Blob([await file.arrayBuffer()]), file.name);
  uploadForm.append("api_key", apiKey);
  uploadForm.append("timestamp", timestamp);
  uploadForm.append("folder", folder);
  uploadForm.append("signature", signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: "POST",
    body: uploadForm
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || "Cloudinary upload failed");
  }

  return data as CloudinaryUploadResult;
}
