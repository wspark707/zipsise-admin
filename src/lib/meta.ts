// path: src/lib/meta.ts
import { sGet } from "@/lib/strapi-server";  // ← 변경

export type FieldSchema = {
  type: string;
  required?: boolean;
  enum?: string[];
  relation?: string;
  target?: string;
  multiple?: boolean;
  components?: string[];
};

export type CollectionMeta = {
  uid: string;
  apiName: string;
  collectionName: string;
  info?: { displayName?: string; description?: string };
  attributes: Record<string, FieldSchema>;
};

export async function fetchAllCollections(): Promise<CollectionMeta[]> {
  const res = await sGet<{ data: CollectionMeta[] }>("/meta/content-types");
  return (res.data || []).sort((a, b) => (a.info?.displayName ?? a.apiName).localeCompare(b.info?.displayName ?? b.apiName));
}

export function labelOf(c: CollectionMeta) {
  return c.info?.displayName || c.apiName;
}
