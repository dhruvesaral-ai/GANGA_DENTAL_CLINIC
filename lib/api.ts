import { NextResponse } from "next/server";

export function jsonError(message: string, status: number) {
  return NextResponse.json({ success: false, message }, { status });
}

export function jsonSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}
