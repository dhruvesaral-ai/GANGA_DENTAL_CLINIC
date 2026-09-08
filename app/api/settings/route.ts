import { jsonError, jsonSuccess } from "@/lib/api";
import { getSeoSettings, setSettings, SETTING_KEYS } from "@/lib/settings";

export async function GET() {
  try {
    const seo = await getSeoSettings();
    return jsonSuccess(seo);
  } catch (error) {
    console.error("GET /api/settings:", error);
    return jsonError("Failed to fetch settings", 500);
  }
}

export async function PUT(request: Request) {
  try {
    const { metaTitle, metaDescription } = await request.json();

    const title = metaTitle?.trim();
    const description = metaDescription?.trim();

    if (!title) {
      return jsonError("Meta title is required", 400);
    }

    if (!description) {
      return jsonError("Meta description is required", 400);
    }

    if (title.length > 70) {
      return jsonError("Meta title must be 70 characters or fewer", 400);
    }

    if (description.length > 160) {
      return jsonError("Meta description must be 160 characters or fewer", 400);
    }

    await setSettings({
      [SETTING_KEYS.META_TITLE]: title,
      [SETTING_KEYS.META_DESCRIPTION]: description,
    });

    return jsonSuccess({ metaTitle: title, metaDescription: description });
  } catch (error) {
    console.error("PUT /api/settings:", error);
    return jsonError("Failed to update settings", 500);
  }
}
