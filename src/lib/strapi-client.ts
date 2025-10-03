// path: src/lib/strapi-client.ts
// ⛔ server-only 사용 금지 (클라이언트에서 import됨)

/** 클라이언트는 반드시 내부 프록시 경유 */
const PROXY = "/api/_strapi";

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${PROXY}${path}`, { ...init, cache: "no-store" });
  if (!res.ok) throw new Error(`GET ${path} ${res.status}`);
  return res.json() as Promise<T>;
}
export async function apiPost<T>(path: string, body: any): Promise<T> {
  const res = await fetch(`${PROXY}${path}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`POST ${path} ${res.status}`);
  return res.json() as Promise<T>;
}
export async function apiPut<T>(path: string, body: any): Promise<T> {
  const res = await fetch(`${PROXY}${path}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`PUT ${path} ${res.status}`);
  return res.json() as Promise<T>;
}
export async function apiDelete<T>(path: string): Promise<T> {
  const res = await fetch(`${PROXY}${path}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`DELETE ${path} ${res.status}`);
  return res.json() as Promise<T>;
}
