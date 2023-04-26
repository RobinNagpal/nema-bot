import { TableActions } from 'components/core/table/Table';
import { useRouter } from 'next/router';

export const useDocumentActions = (): TableActions => {
  const router = useRouter();

  const onSelect = (key: string, item: { id: string }) => {
    switch (key) {
      case 'view':
        router.push(`/documents/${item.id}`);
        break;
      case 'edit':
        router.push(`/documents/${item.id}/edit`);
        break;
      case 'delete':
        break;
    }
  };

  const actions: TableActions = {
    items: [
      { label: 'View', key: 'view' },
      { label: 'Edit', key: 'edit' },
      { label: 'Delete', key: 'delete' },
    ],
    onSelect,
  };

  return actions;
};
