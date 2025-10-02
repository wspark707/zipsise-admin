import GenericList from '@/components/crud/generic-list';
import { getCollectionConfig } from '@/lib/collection-config';

export default function RegionSggsPage() {
  const config = getCollectionConfig('cm-region-sggs');
  if (!config) return <div>Collection not found</div>;
  return <GenericList config={config} />;
}