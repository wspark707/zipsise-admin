import { fetchAllCollections } from "@/lib/meta";
import GenericForm from "@/components/crud/generic-form";

export default async function EditPage({ params }: { params: { collection: string; id: string } }) {
  const metas = await fetchAllCollections();
  const meta = metas.find(m => m.apiName === params.collection);
  if (!meta) return <div className="p-6">Unknown collection</div>;
  return <GenericForm meta={meta} mode="edit" id={params.id} />;
}
