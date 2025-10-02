import GenericForm from '@/components/crud/generic-form';
import { getCollectionConfig } from '@/lib/collection-config';

export default function EditTradeRentAptPage({ params }: { params: { id: string } }) {
  const config = getCollectionConfig('cm-trade-rent-apts');
  if (!config) return <div>Collection not found</div>;
  return <GenericForm config={config} documentId={params.id} mode="edit" />;
}