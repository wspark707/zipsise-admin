"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { apiGet, apiDelete } from "@/lib/strapi-client";
import type { CollectionMeta } from "@/lib/meta";

type Props = { meta: CollectionMeta };

export default function GenericList({ meta }: Props) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const displayFields = useMemo(() => {
    // 기본 컬럼 후보: id, title/name/label, createdAt, updatedAt
    const fields = ["id"];
    if (meta.attributes["title"]) fields.push("title");
    else if (meta.attributes["name"]) fields.push("name");
    else if (meta.attributes["label"]) fields.push("label");
    if (meta.attributes["createdAt"]) fields.push("createdAt");
    if (meta.attributes["updatedAt"]) fields.push("updatedAt");
    return fields;
  }, [meta]);

  async function load() {
    setLoading(true);
    // Strapi v5: /api/{apiName}?populate=*
    const res = await apiGet<{ data: any[] }>(`/${meta.apiName}?populate=*`);
    setItems(res.data || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, [meta.apiName]);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">{meta.info?.displayName || meta.apiName}</h1>
        <Link href={`/${meta.apiName}/create`} className="px-3 py-2 border rounded">새로 만들기</Link>
      </div>
      <div className="overflow-auto border rounded">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {displayFields.map(f => <th key={f} className="px-3 py-2 text-left">{f}</th>)}
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row: any) => {
              const id = row.documentId || row.id;
              return (
                <tr key={id} className="border-t">
                  {displayFields.map(f => <td key={f} className="px-3 py-2">{String(row[f] ?? "")}</td>)}
                  <td className="px-3 py-2 space-x-2">
                    <Link href={`/${meta.apiName}/${id}`} className="underline">보기</Link>
                    <Link href={`/${meta.apiName}/${id}/edit`} className="underline">수정</Link>
                    <button
                      onClick={async () => { if (confirm("삭제할까요?")) { await apiDelete(`/${meta.apiName}/${id}`); await load(); } }}
                      className="text-red-600 underline"
                    >삭제</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
