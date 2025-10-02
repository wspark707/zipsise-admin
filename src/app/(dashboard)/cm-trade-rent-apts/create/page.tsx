import GenericForm from '@/components/crud/generic-form';
import { getCollectionConfig } from '@/lib/collection-config';

export default function CreateTradeRentAptPage() {
  const config = getCollectionConfig('cm-trade-rent-apts');
  if (!config) return <div>Collection not found</div>;
  return <GenericForm config={config} mode="create" />;
}