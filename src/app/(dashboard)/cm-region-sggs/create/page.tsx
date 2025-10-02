import GenericForm from '@/components/crud/generic-form';
import { getCollectionConfig } from '@/lib/collection-config';

export default function CreateRegionSggPage() {
  const config = getCollectionConfig('cm-region-sggs');
  if (!config) return <div>Collection not found</div>;
  return <GenericForm config={config} mode="create" />;
}