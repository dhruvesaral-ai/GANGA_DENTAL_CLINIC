import { jsonError, jsonSuccess } from "@/lib/api";
import { getSiteSettings } from "@/lib/site-settings-server";

export async function GET() {
  try {
    const settings = await getSiteSettings();
    return jsonSuccess(settings);
  } catch (error) {
    console.error("GET /api/site-settings:", error);
    return jsonError("Failed to fetch site settings", 500);
  }
}
