// path: src/app/api/_meta/route.ts
import { NextResponse } from "next/server";
import { fetchAllCollections } from "@/lib/meta";

export const revalidate = 0;
export async function GET() {
  try {
    const data = await fetchAllCollections();
    return NextResponse.json(data);
  } catch (e: any) {
    return new NextResponse(e?.message || "meta error", { status: 500 });
  }
}
