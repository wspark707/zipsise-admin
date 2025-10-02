// cm-school-infos/[id]/edit/page.tsx
import { use } from 'react';
import GenericForm from '@/components/crud/generic-form';
import { getCollectionConfig } from '@/lib/collection-config';

export default function EditSchoolInfoPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const config = getCollectionConfig('cm-school-infos');
  if (!config) return <div>Collection not found</div>;
  return <GenericForm config={config} documentId={resolvedParams.id} mode="edit" />;
}