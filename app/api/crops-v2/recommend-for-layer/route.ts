import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8001";

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const backendRes = await fetch(
      `${BACKEND_URL}/api/crops-v2/recommend-for-layer`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );
    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (err) {
    console.error("[crops-v2/recommend-for-layer] upstream error:", err);
    return NextResponse.json(
      { error: "Could not reach the backend. Please try again later." },
      { status: 502 }
    );
  }
}

