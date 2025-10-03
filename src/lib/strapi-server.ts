// path: src/lib/strapi-server.ts
import "server-only";
import { getServerSession } from "next-auth";
import { authOptions } from "./server-auth-options";

const API = process.env.NEXT_PUBLIC_STRAPI_API_URL!;
const READONLY = process.env.STRAPI_REST_READONLY_API_KEY || "";

function buildHeaders(extra: Record<string, string> = {}) {
  return { Accept: "application/json", ...extra };
}

async function authHeader() {
  const session = await getServerSession(authOptions);
  if (session?.user?.jwt) return { Authorization: `Bearer ${session.user.jwt}` };
  if (READONLY) return { "X-Readonly-Key": READONLY };
  return {};
}

export async function sGet<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: buildHeaders({ ...(await authHeader()) }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`GET ${path} ${res.status} ${await res.text()}`);
  return res.json() as Promise<T>;
}

export async function sMutate<T>(method: "POST"|"PUT"|"PATCH"|"DELETE", path: string, body?: any): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: buildHeaders({
      ...(await authHeader()),
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
    }),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`${method} ${path} ${res.status} ${await res.text()}`);
  return res.json() as Promise<T>;
}
