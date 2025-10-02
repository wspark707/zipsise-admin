import GenericForm from '@/components/crud/generic-form';
import { getCollectionConfig } from '@/lib/collection-config';

export default function CreateArticlePage() {
  const config = getCollectionConfig('articles');
  
  if (!config) {
    return <div>Collection not found</div>;
  }

  return <GenericForm config={config} mode="create" />;
}