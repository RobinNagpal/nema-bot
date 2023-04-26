import { TableActions } from 'components/core/table/Table';
import { useNotificationContext } from 'contexts/NotificationContext';
import { useIndexDocumentInfoMutation } from 'graphql/generated/generated-types';
import { useRouter } from 'next/router';

export const useDocumentActions = (): TableActions => {
  const router = useRouter();
  const [indexDocumentInfoMutation] = useIndexDocumentInfoMutation();
  const { showNotification } = useNotificationContext();
  const onSelect = (key: string, item: { id: string }) => {
    switch (key) {
      case 'view':
        router.push(`/documents/${item.id}`);
        break;
      case 'edit':
        router.push(`/documents/${item.id}/edit`);
        break;

      case 'index':
        indexDocumentInfoMutation({ variables: { id: item.id, spaceId: 'uniswap' } }).then(() => {
          showNotification({ heading: 'Success', details: 'Document Indexed Successfully', type: 'success', duration: 5000 });
        });
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
      { label: 'Index', key: 'index' },
    ],
    onSelect,
  };

  return actions;
};
