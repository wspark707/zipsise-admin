"use client";
import { useEffect, useMemo, useState } from "react";
import { apiGet, apiPost, apiPut } from "@/lib/strapi-client";
import type { CollectionMeta, FieldSchema } from "@/lib/meta";
import { useRouter } from "next/navigation";

type Props = { meta: CollectionMeta; mode: "create" | "edit"; id?: string };

function isEditableField(name: string, f: FieldSchema) {
  // 시스템 필드 제외
  const deny = new Set(["id", "documentId", "createdAt", "updatedAt", "publishedAt"]);
  if (deny.has(name)) return false;
  // 관계는 간단히 id 숫자/문자 입력으로 1차 지원 (고급 셀렉트는 이후 개선)
  return true;
}

export default function GenericForm({ meta, mode, id }: Props) {
  const router = useRouter();
  const [initial, setInitial] = useState<any>({});
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (mode === "edit" && id) {
        const res = await apiGet<{ data: any }>(`/${meta.apiName}/${id}?populate=*`);
        setInitial(res.data || {});
        setForm(res.data || {});
      }
      setLoading(false);
    })();
  }, [mode, id, meta.apiName]);

  const fields = useMemo(
    () => Object.entries(meta.attributes).filter(([name, f]) => isEditableField(name, f)),
    [meta]
  );

  if (loading) return <div className="p-6">Loading...</div>;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (mode === "create") {
      const res = await apiPost<{ data: any }>(`/${meta.apiName}`, { data: form });
      const newId = res?.data?.documentId || res?.data?.id;
      router.push(`/${meta.apiName}/${newId}`);
    } else {
      await apiPut(`/${meta.apiName}/${id}`, { data: form });
      router.push(`/${meta.apiName}/${id}`);
    }
  }

  return (
    <form className="p-6 space-y-4" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {meta.info?.displayName || meta.apiName} {mode === "create" ? "생성" : "수정"}
      </h1>

      {fields.map(([name, f]) => (
        <div key={name} className="space-y-1">
          <label className="text-sm font-medium">{name}{f.required && <span className="text-red-500">*</span>}</label>
          {f.enum ? (
            <select className="border rounded px-2 py-2 w-full"
              value={form[name] ?? ""}
              onChange={(e) => setForm((s: any) => ({ ...s, [name]: e.target.value }))}>
              <option value="">선택</option>
              {f.enum.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          ) : f.type === "boolean" ? (
            <input type="checkbox"
              checked={!!form[name]}
              onChange={(e) => setForm((s: any) => ({ ...s, [name]: e.target.checked }))} />
          ) : f.type === "text" || f.type === "string" ? (
            <input className="border rounded px-2 py-2 w-full" value={form[name] ?? ""}
              onChange={(e) => setForm((s: any) => ({ ...s, [name]: e.target.value }))} />
          ) : f.type === "richtext" || f.type === "json" ? (
            <textarea className="border rounded px-2 py-2 w-full h-32" value={form[name] ?? ""}
              onChange={(e) => setForm((s: any) => ({ ...s, [name]: e.target.value }))} />
          ) : f.type === "integer" || f.type === "biginteger" || f.type === "float" || f.type === "decimal" || f.type === "number" ? (
            <input type="number" className="border rounded px-2 py-2 w-full" value={form[name] ?? ""}
              onChange={(e) => setForm((s: any) => ({ ...s, [name]: e.target.value === "" ? null : Number(e.target.value) }))} />
          ) : f.type === "date" || f.type === "datetime" ? (
            <input type="datetime-local" className="border rounded px-2 py-2 w-full"
              value={form[name] ? new Date(form[name]).toISOString().slice(0,16) : ""}
              onChange={(e) => setForm((s: any) => ({ ...s, [name]: e.target.value }))} />
          ) : f.relation ? (
            <input className="border rounded px-2 py-2 w-full"
              placeholder={`relation ${f.relation} -> ${f.target} (id/documentId 입력)`}
              value={form[name] ?? ""}
              onChange={(e) => setForm((s: any) => ({ ...s, [name]: e.target.value }))} />
          ) : (
            <input className="border rounded px-2 py-2 w-full" value={form[name] ?? ""}
              onChange={(e) => setForm((s: any) => ({ ...s, [name]: e.target.value }))} />
          )}
        </div>
      ))}

      <div className="pt-2">
        <button className="px-4 py-2 border rounded">{mode === "create" ? "생성" : "저장"}</button>
      </div>
    </form>
  );
}
