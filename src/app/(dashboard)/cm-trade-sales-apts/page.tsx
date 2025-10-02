import GenericList from '@/components/crud/generic-list';
import { getCollectionConfig } from '@/lib/collection-config';

export default function TradeSalesAptsPage() {
  const config = getCollectionConfig('cm-trade-sales-apts');
  if (!config) return <div>Collection not found</div>;
  return <GenericList config={config} />;
}