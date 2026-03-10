import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8001";

export async function GET() {
  const res = await fetch(BACKEND_URL + "/presets");
  const data = await res.json();
  return NextResponse.json(data);
}
