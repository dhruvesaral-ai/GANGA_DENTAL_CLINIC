import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { jsonError, jsonSuccess } from "@/lib/api";
import {
  createSessionToken,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/auth";
import { UserModel } from "@/models/UserModel";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      return jsonError("Email and password are required", 400);
    }

    const user = await UserModel.findOne({ email }).select("+password");
    if (!user) {
      return jsonError("Invalid email or password", 401);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return jsonError("Invalid email or password", 401);
    }

    const token = await createSessionToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const response = jsonSuccess({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());

    return response;
  } catch (error) {
    console.error("POST /api/auth/login:", error);
    return jsonError("Login failed", 500);
  }
}
