import { NextResponse } from "next/server";

export function errorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

export function jsonError(message: string, status: number, error?: unknown) {
  const body: { success: false; message: string; error?: string } = {
    success: false,
    message,
  };
  if (error !== undefined) {
    body.error = errorMessage(error);
  }
  return NextResponse.json(body, { status });
}

export function jsonSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}
