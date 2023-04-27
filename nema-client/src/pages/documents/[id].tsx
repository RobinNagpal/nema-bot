import DetailsContainer from 'components/core/details/DetailsContainer';
import DetailsTextField from 'components/core/details/DetailsTextField';
import EllipsisDropdown from 'components/core/dropdowns/EllipsisDropdown';
import DefaultLayout from 'components/layouts/DefaultLayout';
import { useDocumentInfoQuery } from 'graphql/generated/generated-types';
import { useDocumentActions } from 'hooks/useDocumentInfoActions';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

export default function ViewDocumentInfo() {
  const router = useRouter();
  const { id } = router.query;
  const { data } = useDocumentInfoQuery({ variables: { id: id as string } });
  const actions = useDocumentActions();
  return (
    <DefaultLayout>
      <div className="flex justify-between">
        <Link className="cursor-pointer" href="/documents">
          &#8592; Back
        </Link>
        <EllipsisDropdown
          items={actions.items.filter((item) => item.key !== 'view')}
          onSelect={(key) => {
            actions?.onSelect(key, data?.documentInfo!);
          }}
        />
      </div>
      <div className="mt-10">
        <DetailsContainer heading={'Document Details'}>
          <DetailsTextField label={'Id'} value={data?.documentInfo.id} />
          <DetailsTextField label={'Name'} value={data?.documentInfo.name} />
          <DetailsTextField label={'Url'} value={data?.documentInfo.url} />
          <DetailsTextField label={'Type'} value={data?.documentInfo.type} />
          <DetailsTextField label={'Details'} value={JSON.stringify(data?.documentInfo.details || {})} />
        </DetailsContainer>
      </div>
    </DefaultLayout>
  );
}
