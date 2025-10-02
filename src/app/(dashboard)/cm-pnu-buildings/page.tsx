import GenericList from '@/components/crud/generic-list';
import { getCollectionConfig } from '@/lib/collection-config';

export default function PnuBuildingsPage() {
  const config = getCollectionConfig('cm-pnu-buildings');
  if (!config) return <div>Collection not found</div>;
  return <GenericList config={config} />;
}