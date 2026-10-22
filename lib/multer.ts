import path from "path";
import fs from "fs";
import { writeFile, mkdir } from "fs/promises";
import multer from "multer";

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/avif",
];

export const ALLOWED_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".svg",
  ".avif",
];

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

export const UPLOADS_BASE_PATH = path.join(process.cwd(), "public", "uploads");

// Ensure upload directory exists
export function ensureUploadDir(subFolder = "") {
  const targetDir = subFolder
    ? path.join(UPLOADS_BASE_PATH, subFolder)
    : UPLOADS_BASE_PATH;
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  return targetDir;
}

/**
 * Standard Multer disk storage configuration for images
 */
export const multerStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dir = ensureUploadDir();
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const sanitized = file.originalname
      .replace(ext, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 30);
    const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    cb(null, `${sanitized}-${uniqueSuffix}${ext}`);
  },
});

/**
 * Multer image-only file filter
 */
export const imageFileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype) || !ALLOWED_EXTENSIONS.includes(ext)) {
    return cb(
      new Error(
        `Invalid file type. Only images (${ALLOWED_EXTENSIONS.join(", ")}) are allowed.`
      )
    );
  }
  cb(null, true);
};

/**
 * Ready-to-use Multer instance for images
 */
export const multerImageUpload = multer({
  storage: multerStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: MAX_IMAGE_SIZE,
  },
});

export interface UploadImageOptions {
  fieldName?: string; // name of form field, defaults to searching for 'image', 'file', or first File found
  maxSizeInBytes?: number; // defaults to 5MB
  subFolder?: string; // subfolder inside public/uploads, e.g. "gallery"
  allowedTypes?: string[];
}

export interface UploadImageResult {
  url: string;
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
}

/**
 * Core Next.js App Router image upload helper.
 * Extracts, validates, and saves image from multipart/form-data request.
 * Returns the public URL (e.g. "/uploads/my-image-123.jpg") and metadata.
 */
export async function uploadImage(
  request: Request,
  options: UploadImageOptions = {}
): Promise<UploadImageResult> {
  const {
    fieldName,
    maxSizeInBytes = MAX_IMAGE_SIZE,
    subFolder = "",
    allowedTypes = ALLOWED_IMAGE_TYPES,
  } = options;

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch (err) {
    throw new Error(
      `Failed to parse multipart form data: ${err instanceof Error ? err.message : String(err)}`
    );
  }

  // Find the file
  let file: File | null = null;
  if (fieldName) {
    const candidate = formData.get(fieldName);
    if (candidate && typeof candidate === "object" && "arrayBuffer" in candidate) {
      file = candidate as File;
    }
  } else {
    // Check common field names first
    for (const key of ["image", "file", "photo", "img", "avatar"]) {
      const candidate = formData.get(key);
      if (candidate && typeof candidate === "object" && "arrayBuffer" in candidate) {
        file = candidate as File;
        break;
      }
    }

    // If still not found, search all form entries
    if (!file) {
      for (const [, value] of formData.entries()) {
        if (value && typeof value === "object" && "arrayBuffer" in value) {
          file = value as File;
          break;
        }
      }
    }
  }

  if (!file || !(file instanceof Blob) || file.size === 0) {
    throw new Error("No image file provided in request");
  }

  // Validate file size
  if (file.size > maxSizeInBytes) {
    const maxMb = (maxSizeInBytes / (1024 * 1024)).toFixed(1);
    throw new Error(`Image size exceeds the maximum allowed limit of ${maxMb}MB`);
  }

  // Validate MIME type & extension
  const ext = path.extname(file.name || "").toLowerCase();
  const mime = file.type?.toLowerCase();

  const isMimeValid = mime && allowedTypes.includes(mime);
  const isExtValid = ALLOWED_EXTENSIONS.includes(ext);

  if (!isMimeValid && !isExtValid) {
    throw new Error(
      `Invalid image type (${mime || "unknown"}). Allowed formats: ${ALLOWED_EXTENSIONS.join(", ")}`
    );
  }

  const finalExt = ext || (mime === "image/png" ? ".png" : mime === "image/webp" ? ".webp" : ".jpg");

  // Generate safe unique filename
  const rawBase = path.basename(file.name || "image", ext);
  const sanitized = rawBase.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 30) || "img";
  const uniqueKey = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const filename = `${sanitized}-${uniqueKey}${finalExt}`;

  // Destination directory
  const targetDir = subFolder
    ? path.join(UPLOADS_BASE_PATH, subFolder)
    : UPLOADS_BASE_PATH;
  await mkdir(targetDir, { recursive: true });

  const filePath = path.join(targetDir, filename);

  // Write file to disk
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await writeFile(filePath, buffer);

  const relativeUrl = `/uploads${subFolder ? `/${subFolder}` : ""}/${filename}`;

  return {
    url: relativeUrl,
    filename,
    originalName: file.name,
    size: file.size,
    mimeType: file.type || "application/octet-stream",
  };
}

/**
 * Helper to safely delete an uploaded image from disk
 */
export async function deleteUploadedImage(fileUrlOrPath: string): Promise<boolean> {
  try {
    let relativePath = fileUrlOrPath;
    if (relativePath.startsWith("/uploads/")) {
      relativePath = relativePath.replace("/uploads/", "");
    }
    const fullPath = path.resolve(UPLOADS_BASE_PATH, relativePath);

    // Prevent directory traversal attacks
    if (!fullPath.startsWith(UPLOADS_BASE_PATH)) {
      throw new Error("Invalid file path");
    }

    if (fs.existsSync(fullPath)) {
      await fs.promises.unlink(fullPath);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Failed to delete image:", error);
    return false;
  }
}
