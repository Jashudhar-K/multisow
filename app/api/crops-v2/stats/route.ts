import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8001";

export async function GET(_req: NextRequest): Promise<NextResponse> {
  try {
    const backendRes = await fetch(`${BACKEND_URL}/api/crops-v2/stats`);
    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (err) {
    console.error("[crops-v2/stats] upstream error:", err);
    return NextResponse.json(
      { error: "Could not reach the backend. Please try again later." },
      { status: 502 }
    );
  }
}
