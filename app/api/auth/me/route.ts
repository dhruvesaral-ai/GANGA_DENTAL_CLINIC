import { jsonError, jsonSuccess } from "@/lib/api";
import { getSessionFromCookies } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { UserModel } from "@/models/UserModel";

export async function GET() {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      return jsonError("Not authenticated", 401);
    }

    await connectDB();

    const user = await UserModel.findById(session.userId).lean();
    if (!user) {
      return jsonError("Not authenticated", 401);
    }

    return jsonSuccess({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("GET /api/auth/me:", error);
    return jsonError("Failed to fetch session", 500, error);
  }
}
