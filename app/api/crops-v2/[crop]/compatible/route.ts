import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8001";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ crop: string }> }
): Promise<NextResponse> {
  const { crop } = await params;
  const topN = req.nextUrl.searchParams.get("top_n") ?? "5";
  try {
    const backendRes = await fetch(
      `${BACKEND_URL}/api/crops-v2/${encodeURIComponent(crop)}/compatible?top_n=${topN}`
    );
    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (err) {
    console.error(`[crops-v2/${crop}/compatible] upstream error:`, err);
    return NextResponse.json(
      { error: "Could not reach the backend. Please try again later." },
      { status: 502 }
    );
  }
}
