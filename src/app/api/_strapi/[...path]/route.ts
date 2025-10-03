// path: src/app/api/_strapi/[...path]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/server-auth-options";

const API = process.env.NEXT_PUBLIC_STRAPI_API_URL!;
const READONLY = process.env.STRAPI_REST_READONLY_API_KEY || "";

function passHeaders(src: Headers) {
  // 필요한 최소한만 전달
  const h = new Headers();
  h.set("Accept", "application/json");
  // content-type은 body가 있을 때에만
  const ct = src.get("content-type");
  if (ct) h.set("content-type", ct);
  return h;
}

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxy(req, params);
}
export async function POST(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxy(req, params, "POST");
}
export async function PUT(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxy(req, params, "PUT");
}
export async function PATCH(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxy(req, params, "PATCH");
}
export async function DELETE(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxy(req, params, "DELETE");
}

async function proxy(req: NextRequest, { path }: { path: string[] }, method?: string) {
  const session = await getServerSession(authOptions);
  const url = new URL(req.url);
  const targetURL = `${API}/${path.join("/")}${url.search}`;

  const headers = passHeaders(req.headers);
  if (session?.user?.jwt) {
    headers.set("Authorization", `Bearer ${session.user.jwt}`);
  } else if (READONLY) {
    headers.set("X-Readonly-Key", READONLY);
  }

  const init: RequestInit = {
    method: method || "GET",
    headers,
    body: method && method !== "GET" ? await req.text() : undefined,
    cache: "no-store",
  };

  const rsp = await fetch(targetURL, init);
  const text = await rsp.text();
  const out = new NextResponse(text, { status: rsp.status });
  out.headers.set("content-type", rsp.headers.get("content-type") || "application/json; charset=utf-8");
  return out;
}
