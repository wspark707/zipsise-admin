import GenericList from '@/components/crud/generic-list';
import { getCollectionConfig } from '@/lib/collection-config';

export default function AptListsPage() {
  const config = getCollectionConfig('cm-apt-lists');
  if (!config) return <div>Collection not found</div>;
  return <GenericList config={config} />;
}