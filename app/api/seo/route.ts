import { connectDB } from "@/lib/db";
import { jsonError, jsonSuccess } from "@/lib/api";
import { getSeoSettings, SEO_KEY } from "@/lib/seo";
import { SeoSettingsModel } from "@/models/SeoSettingsModel";

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
    await connectDB();

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

    const seo = await SeoSettingsModel.findOneAndUpdate(
      { key: SEO_KEY },
      { metaTitle: title, metaDescription: description },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )
      .select("metaTitle metaDescription")
      .lean();

    return jsonSuccess({
      metaTitle: seo.metaTitle,
      metaDescription: seo.metaDescription,
    });
  } catch (error) {
    console.error("PUT /api/seo:", error);
    return jsonError("Failed to update SEO settings", 500);
  }
}
