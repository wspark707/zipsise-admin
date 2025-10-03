"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { CollectionMeta } from "@/lib/meta";

export default function Sidebar() {
  const [data, setData] = useState<CollectionMeta[]>([]);
  useEffect(() => {
    fetch("/api/_meta").then(r => r.json()).then(setData).catch(() => setData([]));
  }, []);
  return (
    <aside className="w-64 border-r h-full p-3 overflow-auto">
      <div className="text-xs uppercase text-gray-500 px-2 mb-2">Collections</div>
      <nav className="space-y-1">
        {data.map(ct => (
          <Link key={ct.uid} href={`/${ct.apiName}`} className="block px-2 py-1 rounded hover:bg-gray-50">
            {ct.info?.displayName || ct.apiName}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
