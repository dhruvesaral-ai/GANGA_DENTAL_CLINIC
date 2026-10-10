import { jsonError, jsonSuccess } from "@/lib/api";
import { listSettings, isReservedSeoKey } from "@/lib/settings";
import { connectDB } from "@/lib/db";
import { SettingModel } from "@/models/SettingModel";

const KEY_PATTERN = /^[a-z][a-z0-9_]*$/;

function validateKey(key: string) {
  if (!key?.trim()) {
    return "Key is required";
  }

  const normalized = key.trim();

  if (!KEY_PATTERN.test(normalized)) {
    return "Key must start with a letter and contain only lowercase letters, numbers, and underscores";
  }

  if (isReservedSeoKey(normalized)) {
    return "This key is reserved for SEO settings";
  }

  return null;
}

export async function GET() {
  try {
    const settings = await listSettings();
    return jsonSuccess(settings);
  } catch (error) {
    console.error("GET /api/settings:", error);
    return jsonError("Failed to fetch settings", 500);
  }
}

export async function POST(request: Request) {
  try {
    const { key, value } = await request.json();

    const keyError = validateKey(key);
    if (keyError) {
      return jsonError(keyError, 400);
    }

    if (value === undefined) {
      return jsonError("Value is required", 400);
    }

    const normalizedKey = key.trim();

    await connectDB();

    const existing = await SettingModel.findOne({ key: normalizedKey }).lean();
    if (existing) {
      return jsonError("A setting with this key already exists", 409);
    }

    const setting = await SettingModel.create({ key: normalizedKey, value });

    return jsonSuccess(setting, 201);
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && error.code === 11000) {
      return jsonError("A setting with this key already exists", 409);
    }

    console.error("POST /api/settings:", error);
    return jsonError("Failed to create setting", 500);
  }
}
