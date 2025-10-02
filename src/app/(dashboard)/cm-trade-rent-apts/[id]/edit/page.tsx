// cm-trade-rent-apts/[id]/edit/page.tsx
import { use } from 'react';
import GenericForm from '@/components/crud/generic-form';
import { getCollectionConfig } from '@/lib/collection-config';

export default function EditTradeRentAptPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const config = getCollectionConfig('cm-trade-rent-apts');
  if (!config) return <div>Collection not found</div>;
  return <GenericForm config={config} documentId={resolvedParams.id} mode="edit" />;
}