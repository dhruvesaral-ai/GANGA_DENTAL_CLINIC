import { jsonError, jsonSuccess } from "@/lib/api";
import { deleteSetting, RESERVED_SEO_KEYS, setSetting } from "@/lib/settings";

type RouteContext = { params: Promise<{ key: string }> };

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { key } = await context.params;
    const decodedKey = decodeURIComponent(key);

    if (RESERVED_SEO_KEYS.includes(decodedKey)) {
      return jsonError("This key is reserved for SEO settings", 400);
    }

    const { value } = await request.json();

    if (value === undefined) {
      return jsonError("Value is required", 400);
    }

    const setting = await setSetting(decodedKey, value);

    if (!setting) {
      return jsonError("Setting not found", 404);
    }

    return jsonSuccess(setting);
  } catch (error) {
    console.error("PUT /api/settings/[key]:", error);
    return jsonError("Failed to update setting", 500);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { key } = await context.params;
    const decodedKey = decodeURIComponent(key);

    if (RESERVED_SEO_KEYS.includes(decodedKey)) {
      return jsonError("This key is reserved for SEO settings", 400);
    }

    const setting = await deleteSetting(decodedKey);

    if (!setting) {
      return jsonError("Setting not found", 404);
    }

    return jsonSuccess({ key: decodedKey });
  } catch (error) {
    console.error("DELETE /api/settings/[key]:", error);
    return jsonError("Failed to delete setting", 500);
  }
}
