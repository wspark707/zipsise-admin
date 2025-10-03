// path: src/lib/strapi-client.ts
import "server-only";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/server-auth-options";

const API = process.env.NEXT_PUBLIC_STRAPI_API_URL!;
const READONLY = process.env.STRAPI_REST_READONLY_API_KEY;

function headers(extra: Record<string, string> = {}) {
  const h: Record<string, string> = { Accept: "application/json" };
  if (READONLY) h["X-Readonly-Key"] = READONLY;
  return { ...h, ...extra };
}

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const session = await getServerSession(authOptions);
  const h = headers(
    session?.user?.jwt
      ? { Authorization: `Bearer ${session.user.jwt}` }
      : {}
  );
  const res = await fetch(`${API}${path}`, { ...init, headers: h, cache: "no-store" });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`GET ${path} ${res.status} ${txt}`);
  }
  return res.json() as Promise<T>;
}

export async function apiPost<T>(path: string, body: any): Promise<T> {
  const session = await getServerSession(authOptions);
  const h = headers(
    session?.user?.jwt
      ? { Authorization: `Bearer ${session.user.jwt}`, "Content-Type": "application/json" }
      : { "Content-Type": "application/json" }
  );
  const res = await fetch(`${API}${path}`, { method: "POST", headers: h, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`POST ${path} ${res.status}`);
  return res.json() as Promise<T>;
}

export async function apiPut<T>(path: string, body: any): Promise<T> {
  const session = await getServerSession(authOptions);
  const h = headers(
    session?.user?.jwt
      ? { Authorization: `Bearer ${session.user.jwt}`, "Content-Type": "application/json" }
      : { "Content-Type": "application/json" }
  );
  const res = await fetch(`${API}${path}`, { method: "PUT", headers: h, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`PUT ${path} ${res.status}`);
  return res.json() as Promise<T>;
}

export async function apiDelete<T>(path: string): Promise<T> {
  const session = await getServerSession(authOptions);
  const h = headers(
    session?.user?.jwt
      ? { Authorization: `Bearer ${session.user.jwt}` }
      : {}
  );
  const res = await fetch(`${API}${path}`, { method: "DELETE", headers: h });
  if (!res.ok) throw new Error(`DELETE ${path} ${res.status}`);
  return res.json() as Promise<T>;
}
