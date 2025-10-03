// path: src/lib/meta.ts
import { apiGet } from "@/lib/strapi-client";

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
  uid: string;              // "api::brand.brand"
  apiName: string;          // "brand"
  collectionName: string;   // table
  info?: { displayName?: string; description?: string };
  attributes: Record<string, FieldSchema>;
};

export async function fetchAllCollections(): Promise<CollectionMeta[]> {
  const res = await apiGet<{ data: CollectionMeta[] }>("/meta/content-types");
  // 정렬: displayName 기준
  return (res.data || []).sort((a, b) => (a.info?.displayName ?? a.apiName).localeCompare(b.info?.displayName ?? b.apiName));
}

// 라벨 표기
export function labelOf(c: CollectionMeta) {
  return c.info?.displayName || c.apiName;
}
