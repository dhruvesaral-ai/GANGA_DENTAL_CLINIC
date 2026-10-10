import { jsonError, jsonSuccess } from "@/lib/api";
import { getSeoSettings, setSettings, SETTING_KEYS } from "@/lib/settings";

export async function GET() {
  try {
    const seo = await getSeoSettings();
    return jsonSuccess(seo);
  } catch (error) {
    console.error("GET /api/seo:", error);
    return jsonError("Failed to fetch SEO settings", 500);
  }
}

export async function PUT(request: Request) {
  try {
    const { metaTitle, metaDescription, metaKeywords } = await request.json();

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

    const keywords = Array.isArray(metaKeywords)
      ? metaKeywords
          .filter((k: unknown): k is string => typeof k === "string")
          .map((k) => k.trim())
          .filter(Boolean)
      : [];

    await setSettings({
      [SETTING_KEYS.META_TITLE]: title,
      [SETTING_KEYS.META_DESCRIPTION]: description,
      [SETTING_KEYS.META_KEYWORDS]: keywords,
    });

    return jsonSuccess({ metaTitle: title, metaDescription: description, metaKeywords: keywords });
  } catch (error) {
    console.error("PUT /api/seo:", error);
    return jsonError("Failed to update SEO settings", 500);
  }
}
