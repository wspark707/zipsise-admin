// cm-apt-energies/[id]/edit/page.tsx
import { use } from 'react';
import GenericForm from '@/components/crud/generic-form';
import { getCollectionConfig } from '@/lib/collection-config';

export default function EditAptEnergyPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const config = getCollectionConfig('cm-apt-energies');
  if (!config) return <div>Collection not found</div>;
  return <GenericForm config={config} documentId={resolvedParams.id} mode="edit" />;
}