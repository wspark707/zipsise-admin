"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { apiGet } from "@/lib/strapi-client";
import type { CollectionMeta } from "@/lib/meta";

type Props = { meta: CollectionMeta; id: string };

export default function GenericDetail({ meta, id }: Props) {
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    apiGet<any>(`/${meta.apiName}/${id}?populate=*`).then(setData);
  }, [meta.apiName, id]);

  if (!data) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between">
        <h1 className="text-xl font-semibold">{meta.info?.displayName || meta.apiName} 상세</h1>
        <Link href={`/${meta.apiName}/${id}/edit`} className="px-3 py-2 border rounded">수정</Link>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        {Object.entries<any>(data).map(([k, v]) => (
          <div key={k} className="border rounded p-3">
            <div className="text-xs text-gray-500">{k}</div>
            <div className="font-medium break-words">{typeof v === "object" ? JSON.stringify(v) : String(v ?? "")}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
