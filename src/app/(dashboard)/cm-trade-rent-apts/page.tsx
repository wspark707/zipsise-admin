import GenericList from '@/components/crud/generic-list';
import { getCollectionConfig } from '@/lib/collection-config';

export default function TradeRentAptsPage() {
  const config = getCollectionConfig('cm-trade-rent-apts');
  if (!config) return <div>Collection not found</div>;
  return <GenericList config={config} />;
}