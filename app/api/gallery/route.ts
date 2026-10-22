import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { jsonError, jsonSuccess } from "@/lib/api";
import { GalleryModel } from "@/models/GalleryModel";
import { getSessionFromCookies } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const position = request.nextUrl.searchParams.get("position");
    const showAll = request.nextUrl.searchParams.get("all") === "true";

    const filter: Record<string, unknown> = {};
    if (!showAll) {
      filter.is_active = true;
    }
    if (position && ["home-carousal", "gallery"].includes(position)) {
      filter.position = position;
    }

    const items = await GalleryModel.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return jsonSuccess(items);
  } catch (error) {
    console.error("GET /api/gallery:", error);
    return jsonError("Failed to fetch gallery items", 500, error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromCookies();
    if (!session || session.role !== "admin") {
      return jsonError("Unauthorized: Admin access required", 401);
    }

    await connectDB();

    const body = await request.json();
    const { img_url, position, is_active } = body;

    if (!img_url || typeof img_url !== "string") {
      return jsonError("Image URL is required", 400);
    }

    if (!position || !["home-carousal", "gallery"].includes(position)) {
      return jsonError("Position must be either 'home-carousal' or 'gallery'", 400);
    }

    const item = await GalleryModel.create({
      img_url: img_url.trim(),
      position,
      is_active: typeof is_active === "boolean" ? is_active : true,
    });

    return jsonSuccess(item, 201);
  } catch (error) {
    console.error("POST /api/gallery:", error);
    return jsonError("Failed to create gallery item", 500, error);
  }
}
