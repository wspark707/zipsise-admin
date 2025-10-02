import GenericForm from '@/components/crud/generic-form';
import { getCollectionConfig } from '@/lib/collection-config';

export default function EditRegionSidoPage({ params }: { params: { id: string } }) {
  const config = getCollectionConfig('cm-region-sidos');
  if (!config) return <div>Collection not found</div>;
  return <GenericForm config={config} documentId={params.id} mode="edit" />;
}