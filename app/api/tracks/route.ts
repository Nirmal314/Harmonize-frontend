import { NextResponse } from "next/server";

let tracksWithCategories = {};

export async function POST(request: Request) {
  const data = await request.json();

  console.log("data: ", data);

  tracksWithCategories = data;
  return NextResponse.json({ status: 200, message: "Data posted" });
}
export async function GET() {
  return NextResponse.json({ status: 200, tracks: tracksWithCategories });
}
