import { fetchAllCollections } from "@/lib/meta";
import GenericDetail from "@/components/crud/generic-detail";

export const dynamic = "force-dynamic";

export default async function DetailPage({ params }: { params: { collection: string; id: string } }) {
  const metas = await fetchAllCollections();
  const meta = metas.find(m => m.apiName === params.collection);
  if (!meta) return <div className="p-6">Unknown collection</div>;
  return <GenericDetail meta={meta} id={params.id} />;
}
