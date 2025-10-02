import GenericList from '@/components/crud/generic-list';
import { getCollectionConfig } from '@/lib/collection-config';

export default function SchoolInfosPage() {
  const config = getCollectionConfig('cm-school-infos');
  if (!config) return <div>Collection not found</div>;
  return <GenericList config={config} />;
}