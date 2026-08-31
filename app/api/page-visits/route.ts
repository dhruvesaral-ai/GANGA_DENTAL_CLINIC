import { connectDB } from "@/lib/db";
import { jsonError, jsonSuccess } from "@/lib/api";
import { PageVisitModel } from "@/models/PageVisitModel";

const LANDING_PAGE = "landing";

export async function GET() {
  try {
    await connectDB();

    const visit = await PageVisitModel.findOne({ page: LANDING_PAGE })
      .select("count")
      .lean();

    return jsonSuccess({ count: visit?.count ?? 0 });
  } catch (error) {
    console.error("GET /api/page-visits:", error);
    return jsonError("Failed to fetch page visits", 500);
  }
}

export async function POST() {
  try {
    await connectDB();

    const visit = await PageVisitModel.findOneAndUpdate(
      { page: LANDING_PAGE },
      { $inc: { count: 1 } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    return jsonSuccess({ count: visit.count });
  } catch (error) {
    console.error("POST /api/page-visits:", error);
    return jsonError("Failed to record page visit", 500);
  }
}
