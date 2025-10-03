// path: src/app/(dashboard)/[collection]/page.tsx
import { fetchAllCollections } from "@/lib/meta";
import GenericList from "@/components/crud/generic-list";

export const dynamic = "force-dynamic";

export default async function CollectionListPage({ params }: { params: { collection: string } }) {
  const { collection } = params;
  const metas = await fetchAllCollections();
  const meta = metas.find(m => m.apiName === collection);
  if (!meta) return <div className="p-6">Unknown collection: {collection}</div>;
  return <GenericList meta={meta} />;
}
