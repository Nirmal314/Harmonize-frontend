import { NextResponse } from "next/server";

let tracksWithCategories = {};

export async function POST(request: Request) {
  tracksWithCategories = await request.json();
  return NextResponse.json({ status: 200, message: "Data posted" });
}
export async function GET() {
  return NextResponse.json({ status: 200, tracks: tracksWithCategories });
}
