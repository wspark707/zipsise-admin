import GenericList from '@/components/crud/generic-list';
import { getCollectionConfig } from '@/lib/collection-config';

export default function ArticlesPage() {
  const config = getCollectionConfig('articles');
  
  if (!config) {
    return <div>Collection not found</div>;
  }

  return <GenericList config={config} />;
}