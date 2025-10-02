import GenericForm from '@/components/crud/generic-form';
import { getCollectionConfig } from '@/lib/collection-config';

export default function CreateTradeSalesAptPage() {
  const config = getCollectionConfig('cm-trade-sales-apts');
  if (!config) return <div>Collection not found</div>;
  return <GenericForm config={config} mode="create" />;
}