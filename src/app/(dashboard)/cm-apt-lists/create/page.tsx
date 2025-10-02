import GenericForm from '@/components/crud/generic-form';
import { getCollectionConfig } from '@/lib/collection-config';

export default function CreateAptListPage() {
  const config = getCollectionConfig('cm-apt-lists');
  if (!config) return <div>Collection not found</div>;
  return <GenericForm config={config} mode="create" />;
}