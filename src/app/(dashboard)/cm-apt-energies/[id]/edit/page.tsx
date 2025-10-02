import GenericForm from '@/components/crud/generic-form';
import { getCollectionConfig } from '@/lib/collection-config';

export default function EditAptEnergyPage({ params }: { params: { id: string } }) {
  const config = getCollectionConfig('cm-apt-energies');
  if (!config) return <div>Collection not found</div>;
  return <GenericForm config={config} documentId={params.id} mode="edit" />;
}