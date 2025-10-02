import GenericList from '@/components/crud/generic-list';
import { getCollectionConfig } from '@/lib/collection-config';

export default function AptEnergiesPage() {
  const config = getCollectionConfig('cm-apt-energies');
  if (!config) return <div>Collection not found</div>;
  return <GenericList config={config} />;
}